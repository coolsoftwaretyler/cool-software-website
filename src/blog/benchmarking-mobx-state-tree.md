---
layout: post
title: "Benchmarking MobX-State-Tree Performance"
tags: ["post"]
description: "Introducing a system to benchmark MobX-State-Tree performance and memory usage across environments."
date: 2023-10-08
canonical_url: "https://coolsoftware.dev/blog/benchmarking-mobx-state-tree-performance/"
highlight: MobX-State-Tree
---

Jamon Holmgren put together a [Twitter poll](https://twitter.com/jamonholmgren/status/1704603475504767284) asking if the MobX-State-Tree core team should:

1. Improve TypeScript types
2. Improve performance

Improving performance won with 48.6% of the vote.

The poll only had 72 participants, and 16.7% of them just voted to watch the results, but [we also receive many issues about performance](https://github.com/mobxjs/mobx-state-tree/issues?q=is%3Aissue+is%3Aopen+performance). Jamon and I also asked our own coworkers who use MST daily. Their consensus was also that performance is more impactful than TypeScript improvements. We're a community-driven project, so we are taking this guidance seriously. We're going to make MobX-State-Tree more performant.

## So where do we start?

Here's the thing about performance improvements: if you can't define and measure the performance of your system, you cannot diagnose performance problems, fix them, or prove that your changes have actually led to improvements. So before we can actually fix the performance issues of MobX-State-Tree, we have to understand the existing performance profile of the library.

MobX-State-Tree has some [existing performance tests](https://github.com/mobxjs/mobx-state-tree/tree/1d600ed6319a9645c0789303d3e9c6179809d43f/packages/mobx-state-tree/__tests__/perf), but they aren't comprehensive, and [it looks like we aren't sure how useful they are](https://github.com/mobxjs/mobx-state-tree/blob/1d600ed6319a9645c0789303d3e9c6179809d43f/packages/mobx-state-tree/__tests__/perf/perf.test.ts#L4). So I set out to build a system to test MobX-State-Tree's performance from scratch. Here's how.

## What does a good benchmarking suite look like?

To start, I wrote down the characteristics I wanted out of a benchmarkin tool:

1. Contributors should only need to write JavaScript and MobX-State-Tree code. Each scenario should get written once and tested across multiple environments.
2. Speaking of environments, we need to be able to benchmark in Node, browsers, and Hermes (for React Native).
3. The benchmarking suite should be simple to run. If it's too complex to install, set up, and use, we'll never get anyone actually using it.
4. The suite should be runnable in the cloud so we can eventually hook it up to the MobX-State-Tree CI pipeline.
5. The output of the suite should be highly portable so people can independently analyze it any way they like.

For the most part, I think I accomplished these requirements, with a handful of caveats. If you want to jump right in, go check it out at [https://github.com/coolsoftwaretyler/mst-performance-testing](https://github.com/coolsoftwaretyler/mst-performance-testing).

If you want to read more about how it all works, read on!

## Write once, test many times

There's a tension between open source maintainers and open source users: maintainers want people to put together demonstrable, minimal reproductions of their problems, and open source users don't have the time or support to extract their day-to-day code into a minimally useful reproduction of their issue. This tension can leave both parties feeling frustrated.

I really want MST users to submit benchmarking scenarios. The more diverse those scenarios are, the better we can exercise and diagnose MST's performance issues, and the more effective we can be at improving MST's performance. So to encourage people to submit their scenarios, I have set up the suite in such a way that all you need to do is export one object from `scenarios/index.js` to be included in the tests. [You can see that file here](https://github.com/coolsoftwaretyler/mst-performance-testing/blob/main/scenarios/index.js).

Any exported object in that file with a title and a `run` function will get automatically imported into [`runner.js`](https://github.com/coolsoftwaretyler/mst-performance-testing/blob/main/runner.js) and bundled for benchmarking across environments. That means you can write and include helper files if you like, or you can write one-line functions. As long as you submit a PR with an exported object shaped as `{ title: 'Some title', run() { // function here }}`, your scenario will become one of our benchmarking tests!

The one caveat here is that we don't have a way to handle cross-environment compatibility within scenarios themselves (yet!). So we ask that you write [isomorphic code](https://www.solwey.com/posts/isomorphic-code-the-key-to-seamless-cross-platform-user-experiences#:~:text=Isomorphic%20code%20works%20by%20using,load%20times%20and%20improved%20performance.) - code that doesn't depend on browser-specific, Node-specific, or React Native-specific APIs. In the future, I'm hoping we can improve our bundling step to skip or polyfill those things as appropriate.

## Benchmarking Node, browsers, and React Native

For this criteria, I hope folks will agree that two out of three ain't bad. We have the ability to test our scenarios in Node, and in a Browser environment using [Puppeteer](https://pptr.dev/). Right now we just run Puppeteer with Chrome, but we should be able to iterate and add other browser options in the future. We accomplish this with [webpack](results/5.2.0-2023-10-08T20:39:29-node-results.csv), where we take the `runner.js` file and bundle it up, including any dependencies included through `runner.js`. Those bundles end up in `build/`, with a platform suffix.

Unfortunately, [there is no way to run code in a React Native like environment directly from the CLI](https://x.com/tmikov/status/1710486541800554962?s=20). Initially, I thought we could leverage the [unsupported node-hermes tool](https://github.com/tmikov/hermes/tree/fb7a2486787a2659f194936573c9a2cd1370541b/tools/node-hermes), but [Tzvetan informed me that this would not be representative of anything other than node-hermes itself](https://x.com/tmikov/status/1710346203647602727?s=20).

It sounds like there are [a good amount of people in the React Native community who want a tool like this](https://x.com/tmikov/status/1710488982772166990?s=20), so I'm hopeful we'll see some movement there. If we ever get a command line tool that can run JavaScript through React Native/Hermes environment, adding it to this suite will be trivial.

If that effort takes a while (very understandably!), then we might explore a way to embed a simple React Native application in the suite and gather metrics programmatically from a simulator/emulator. However, I am going to hold off for now because I think that will make the suite too complex to set up, which would violate my next requirement, which is:

## Simple tools get used

The easier and simpler it is to run a tool, the more likely people will be to use it! Not much to say here. I did my best to keep all of the tools node-based, and to rely on system utilities that most Unix and Linux systems include. I'm sorry Windows developers - I don't know much about your world and I'm not sure how to help you out. If you develop on a Windows machine and want to augment the suite to work for you, I'd be happy to take a PR!

## Benchmarking in the cloud

Since we're using simple dependencies that can all be run from a \*nix command line, getting this suite to run in the cloud should be pretty straightforward (famous last words). Another caveat - we haven't actually set this up. I want to hold off on integrating this tool with MST's pipeline until it's been around for a few weeks and we've filled out some more initial scenarios. We'll also want to be careful, since the suite takes a long time to run, and we probably don't want to spin it up for every single PR. We'll probably pin this to pre-release branches or other less-frequent scenarios.

## Portable benchmarking data

Each run spits out a file in the `results/` directory that is named like this:

```
results/5.2.0-2023-10-08T20:22:44-node-results.csv
results/5.2.0-2023-10-08T20:39:29-web-results.csv
```

Where the filename format is `<mst-version-number>-<date-and-time-stamp>-<platform>-results.csv`. This embeds metadata about the specific run for you to easily see what and when you were testing. The `.csv` files in this directory are not version controlled, so you can run as many local tests as you like without worrying about git management.

Each of these CSVs has data for:

1. `scenario`: the `title` field in the exported scenario object
2. `ops_per_sec`: how many operations per second our benchmarking tool thinks the scenario can accomplish. Higher `ops_per_sec` roughly denotes "faster".
3. `margin_of_error`: the percentage-based margin of error our benchmarking tool calculated
4. `runs`: how many times the scenario was run in order to arrive at the `ops_per_sec` and `margin_of_error` numbers
5. `max_memory_used_kb`: every time we run a scenario in our benchmarking suite, we check the JavaScript heap memory used before and after. The delta of those values is a rough proxy for "memory used by this scenario". We track the worst case memory usage (largest) and attach it to the results in the csv.

Here's a sample CSV running MobX-State-Tree@5.2.0 in Node.js:

```
scenario,ops_per_sec,margin_of_error,runs,max_memory_used_kb
Create 1 model,9611.266523689474,7.448944964904519,73,279920
Create 1 model and set a float value,9854.259654315947,2.663167731249996,84,291048
Create 1 model and set a boolean value,9523.116318212613,1.8352268812825139,86,71048
Create 1 model and set a date value,9189.506928165893,2.806443896721596,86,276320
Create 10 models,1465.996654037189,4.721162647246289,87,490760
Create 100 models,156.24889845882916,1.621428518573399,80,2711584
Create 1,000 models,15.1865752067892,2.56287095308871,41,10582544
Create 10,000 models,1.5100100214004584,4.017314499977727,8,6032384
Create 100,000 models,0.15064772594015602,8.365649641651725,5,9638608
Create 1 model and set a string value,10373.712113062804,2.7203718589499606,86,70976
Create 1 model and set a number value,9493.736435455972,2.145141308471873,83,55664
Create 1 model and set an integer value,8118.245449714054,10.9890805064934,75,111560
```

I think generating CSV files gives maximum flexibility for futher analysis, but if you'd like to see it in different formats, I'd be happy to review a PR!

## Sharp edges in our benchmarking suite

### Results are directional, not precise

JavaScript code runs on top of:

1. Your machine and its hardware
1. Your operating system
1. Your node version, or the browser version/browser engine version

Not only that, but there is no real way for us to directly manage the garbage collector in JavaScript. [It looks like our benchmarking tool has some logic to prevent the engine from making optimizations](https://github.com/bestiejs/benchmark.js/blob/main/benchmark.js#L1590), but at the end of the day, we can't guarantee how the JavaScript engine will manage its memory and optimization.

All that to say, the results of these tests should be taken as _directional only_. By running these tests, you should be able to determine:

1. The relative speed and memory usage of an MST scenario when compared to different scenario in the same MST version.
1. The relative speed and memory usage of MobX-State-Tree across execution environments (on a specific hardware).
1. Across MST versions, have we improved speed of execution and memory usage? Or have we regressed?

But you _cannot_ say that if you see 20,000 operations per second on a particular scenario, that scenario will _always_ manage to run 20,000 times per second. Or if you see a particular memory usage value, that you'll get a consistent memory usage in that scenario every time it runs.

Over time, we will be able to paint a holistic picture of MobX-State-Tree's performance. We'll find likely bottlenecks, we'll find areas for improvement, and we should be able to protect against regressions and prove our hypthoses when we are experimenting with MST performance.

### Benchmark.js is old (but awesome)

I could not have done any of this without the amazing work behind [benchmark.js](https://github.com/bestiejs/benchmark.js/tree/main). In fact, I couldn't find any suitable alternative for that tool. I don't think there's anything like it out there (this is a great idea for someone looking to build a new open source project around JavaScript performance, by the way).

All that said, [I think this issue sums up my thoughts on the library](https://github.com/bestiejs/benchmark.js/issues/237). Benchmark exports just an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) that expects to find lodash as a global. If you import it in Node, it seems to work OK (probably because of how CommonJS works under the hood). But including it in a browser is not straightforward.

To that end, our [puppeteer script](https://github.com/coolsoftwaretyler/mst-performance-testing/blob/main/puppeteer.cjs) actually _vendors in_ the lodash and benchmark.js libraries. We open a headless browser, open a new page, and then inject an HTML page with a JavaScript template literal. From there, we inline lodash, benchmark.js, and finally our bundle code. It feels like it should be brittle, but I have found it to be somewhat robust. Since benchmark.js isn't likely to see any updates, I'm not too concerned about the node version and web version ending up out of sync.

### Black box testing

This set up is strictly a [black box test](https://www.checkpoint.com/cyber-hub/cyber-security/what-is-penetration-testing/what-is-black-box-testing/#:~:text=Black%20box%20testing%2C%20a%20form,automated%20black%20box%20security%20testing.). We're specifically benchmarking the public API of MobX-State-Tree, which means we'll be able to figure out what public methods have bottlenecks, but we won't be able to drill down to the specific internals mechanisms that are slow.

Still, compared to the current state of things (not much data at all), I think this is a massive step forward. It will help us dig deeper into how we can improve MST's performance. We'll also be able to experiment, validate, and invalidate any possible changes to MST we make in the pursuit of performance improvements.

### No async support (yet)

Truthfully, I just haven't gotten around to implementing async testing. For now, scenarios have to be written synchronously. This tool won't feel complete until we can offer async tests. There's a path forward for that, but I haven't started yet yet. Once we get that put together, I'll probably write about it! Keep an eye out here, or [follow me on Twitter](https://twitter.com/coolsoftwaredev) or [LinkedIn](https://www.linkedin.com/in/tylerwilliamsct/) to get updates

## Help us make MobX-State-Tree faster!

I hope folks like what we've put together here. It's important to us that we do right by our users and continue to improve MobX-State-Tree's performance. Please submit scenarios. Or if you don't know exactly how to code it up, please open an [issue](https://github.com/coolsoftwaretyler/mst-performance-testing/issues) describing what you'd like to test, and I'd be happy to get you started.
