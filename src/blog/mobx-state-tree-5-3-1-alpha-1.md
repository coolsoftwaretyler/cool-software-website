---
layout: post
title: "Faster Model Creation for MobX-State-Tree (Maybe)"
tags: ["post"]
description: "I think we made MobX-State-Tree faster. Help us verify that. Or tell us if we didn't."
date: 2023-11-06
canonical_url: "https://coolsoftware.dev/blog/mobx-state-tree-5-3-1-alpha-1/"
highlight: MobX-State-Tree
---

I am pretty sure that [this pull request](https://github.com/mobxjs/mobx-state-tree/pull/2113) has meaningfully improved the performance of the `create` method on MobX-State-Tree model types.

## Here's how

In the `reduce` function inside `toPropertiesObject`, we've been creating a new object and merging it with `props` for every iteration. This might be a bottleneck if `props` has a lot of keys. Instead, we can directly assign the new property to `props` and avoid the object creation and merging.

We've also been using an object to check for duplicate keys. This requires converting the keys to strings. Using a `Set` should avoid that issue, and IMO is a little nicer to read.

I believe this improves the speed of model creation above the margin of error of my benchmarks. I used [this performance testing tool](https://github.com/coolsoftwaretyler/mst-performance-testing) to check the performance of MST `5.3.0` and this changeset running in node. I haven't yet checked in web or bun. Here's a few relevant test results:

### 5.3.0

```
scenario,ops_per_sec,margin_of_error,runs,max_memory_used_kb
Create 1 model,16255.43556299085,2.0149614245219034,88,280432
Create 10 models,1726.2679949268702,2.1457973152575627,88,326160
Create 100 models,180.8861705629388,1.5603275496951987,84,3003376
Create 1,000 models,15.839075385738038,2.633378708118982,44,12550480
Create 10,000 models,1.5986554744732953,3.055960171640972,8,12361216
Create 100,000 models,0.16010535102193169,7.319537180777344,5,7737616
```

### 5.3.1-alpha.1

```
scenario,ops_per_sec,margin_of_error,runs,max_memory_used_kb
Create 1 model,16129.00654121993,2.5076336085120166,84,290096
Create 10 models,1859.7293521665006,1.8005317075623681,93,345688
Create 100 models,188.2793706606448,1.057293962845895,88,2921632
Create 1,000 models,18.71691771032261,1.1157484919305993,51,11970936
Create 10,000 models,1.8402872820948037,2.0327187905280706,9,7199456
Create 100,000 models,0.18820209480049743,0.6963479413567704,5,2630904
```

### Comparison

1. One model at a time: there's no real difference here, the operations per second seem to be within the margin of error, but this makes sense to me. `benchmark.js` does something under the hood to [prevent the engine from making optimizations](https://github.com/bestiejs/benchmark.js/blob/main/benchmark.js#L1590), so individual model creation never gets optimized test-to-test.
2. 10 models at a time: sees a 7.7% improvement in ops/sec, which is above the margin of error in both cases
3. 100 models at a time: sees a 4% improvement in ops/sec, also above the margin of error in both cases.
4. 1,000 models at a time: 18% improvement. I think this may be inflated because the raw number is smaller than the 1/10/100 case. There are fewer runs. As a counterpoint: it may actually be the case that this change shows up in a bigger way as you create more models. I'm not certain either way, and not sure how to check one way or another yet.
5. 10,000 models at a time: 15% improvement. Since this is similar to the 1k scenario, I'm hopeful that my hypothesis in 1k is true. At the very least, some kind of consistent behavior happens at this scale (either a consistent false positive, or a consistent improvement).
6. 100,000 models at a time: 17.5% improvement. Again, this is either a consistent fluke or a promising trend that holds in these higher numbers.

## Help us verify

Please consider running the [MobX-State-Tree performance suite](https://github.com/coolsoftwaretyler/mst-performance-testing) on your own machine to help gather data from different hardware. It would be awesome if you ran `5.3.0` and `5.3.1-alpha.1` side by side and posted the results in [our discussion forum](https://github.com/coolsoftwaretyler/mst-performance-testing/discussions).

Another way you can help out: if you're running MobX-State-Tree in your day to day work and have some kind of performance measurement of your code, we [published v5.3.1-alpha.1](https://www.npmjs.com/package/mobx-state-tree/v/5.3.1-alpha.1) to make it easier to drop in and test. Will you please let us know what you observe if you do so?

## Where we go from here

It's important to me to find backwards-compatible ways to improve MST's performance. That means our progress will be deliberate, and we need y'all to help ensure we're making good choices. Please give this release candidate a shot.

Here's _why_ it's important to me: MST has a bad reputation for performance. I think that reputation is well deserved. There are many options out there in the state management space that are faster or use less memory than MST these days.

But lots of people use MST already, and they won't switch because they don't have time to do that, or they just love MST. I'm in both categories: there is no business case for me to re-write my app's state management logic just for performance gains.

If we can push backwards-compatible improvements, we can backport improvements to users like myself, and many others who love MST (or perhaps tolerate it, but can't afford to switch).

If you merely tolerate MST and cannot switch, we are here to support you, and hopefully some effort on our end can also bring you around to our perspective (which is: MST is awesome).

Either way, I'm hopeful about the progress we made here. I'm seeing 4-18% improvements in speed, and some possible memory usage reduction. In my own app, I'm seeing qualitative improvements for our model instantiation.

Anyway, I'm stoked for the future, and there is more to come!
