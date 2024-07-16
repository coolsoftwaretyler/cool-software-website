---
layout: post
title:  "Code Archaeology and Misleading Docs"
tags: ['post']
description: "Sometimes being a maintainer makes you confidently wrong in a way that's hard to fix"
date: 2024-07-16
canonical_url: 'https://coolsoftware.dev/expert-in-outdated-minutiae'
highlight: Open Source
---

I'm an open source maintainer of [MobX-State-Tree](https://mobx-state-tree.js.org/intro/welcome), a project that I didn't invent, didn't build initially, and didn't write the documentation for. I became a maintainer by answering a ton of questions in the [GitHub Discussions](https://github.com/mobxjs/mobx-state-tree/discussions), on Twitter, and in various Slack and Discord groups. So what I really brought to the table was:

1. A ton of energy and interest in helping people understand and use MobX-State-Tree
2. A bunch of time invested in reading documentation, old issues, and the source code of the library.

But MobX-State-Tree is old. Its documentation is often outdated or challenging to parse. Many of the "answers" to common questions come from long-stale GitHub issues and discussions. So in a lot of ways, the things I "know" about MST are a lot like archaelogical artifacts - they communicate *something*, but not always the truth.

I'm figuring out more and more that my role as a late-joining maintainer is to interpret the artifacts and validate knowledge through experimentation, rather than just becoming an expert in outdated minutiae.

[Take this discussion as an example](https://github.com/mobxjs/mobx-state-tree/discussions/1994). I [confidently assumed](https://github.com/mobxjs/mobx-state-tree/discussions/1994#discussioncomment-10052496) that an [old, closed issue I had read many times over](https://github.com/mobxjs/mobx-state-tree/issues/818#issue-323164363) was the ground truth. In fact, [our docs still include a mention of it as well](https://mobx-state-tree.js.org/tips/typescript#using-a-mst-type-at-design-time) (I will remove it soon).

But as it happens [the old issue is no longer the observed behavior of the system](https://github.com/mobxjs/mobx-state-tree/discussions/1994#discussioncomment-10065892). So my MST trivia was unhelpful and flat-out wrong.

The lesson for me is that I need to experimentally verify everything I think I know about MST when it comes up to external parties. Fortunately for me - that sounds like a lot of fun! It's a great way to learn about the library.

It's a funny problem, a little frustrating, but overall a great lesson to learn.