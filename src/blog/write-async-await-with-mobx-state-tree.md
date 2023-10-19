---
layout: post
title: "How to write async/await with MobX-State-Tree"
tags: ["post"]
description: "You can, in fact, use async/await with MobX-State-Tree. Here's how."
date: 2023-10-18
canonical_url: "https://coolsoftware.dev/blog/write-async-await-with-mobx-state-tree/"
highlight: MobX-State-Tree
---

If you read the [MobX-State-Tree docs on asynchronous actions](https://mobx-state-tree.js.org/concepts/async-actions), you might come away thinking "I can't use `async / await` in my MobX-State-Tree code".

I wouldn't blame you for thinking that. Right now, the docs say:

> Async/await can only be used in trees that are unprotected. Async / await is not flexible enough to allow MST to wrap asynchronous steps in actions automatically, as is done for the generator functions.

If you decide to try anyways and write a function like this:

```js
import { types } from "mobx-state-tree";

const longRunningTask = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("asdf");
    }, 1000);
  });
};

const User = types
  .model({
    slug: "",
  })
  .actions((self) => ({
    doesNotWork: async () => {
      const newSlug = await longRunningTask();
      self.slug = newSlug;
    },
  }));

const u = User.create();

(async () => {
  try {
    await u.doesNotWork();
  } catch (e) {
    console.warn("We expect the next error here, for demonstration.");
    console.error(e);
  }
})();
```

You'll get an error as follows:

```sh
Error: [mobx-state-tree] Cannot modify 'AnonymousModel@<root>', the object is protected and can only be modified by using an action.
```

[See in CodeSandbox](https://codesandbox.io/s/infallible-sea-dnt72m?file=/src/index.js)

## But that's not the full story

But you can, in fact, accomplish what this code is attempting to do by making one small adjustment. Instead of setting the `slug` property directly from within the asynchronous action, you can call _another action in the model_, and use _that_ to modify the property.

If you do this, you can actually use `async / await` like you're used to, and still get all of the good MobX-State-Tree utility you know and love (including patches and snapshots).

Here's what I mean:

```js
import { onPatch, onSnapshot, types } from "mobx-state-tree";

const longRunningTask = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("asdf");
    }, 1000);
  });
};

const User = types
  .model({
    slug: "",
  })
  .actions((self) => ({
    doesNotWork: async () => {
      const newSlug = await longRunningTask();
      self.slug = newSlug;
    },
    works: async () => {
      const newSlug = await longRunningTask();
      // Using an action is the key to making this work.
      self.setSlug(newSlug);
    },
    // This action will work, even if it's called from an async function.
    setSlug(s) {
      self.slug = s;
    },
  }));

const u = User.create();

const patches = [];
const snapshots = [];

onPatch(u, (p) => patches.push(p));
onSnapshot(u, (s) => snapshots.push(s));

(async () => {
  await u.works();

  console.log("patches", patches);
  console.log("snapshots", snapshots);

  try {
    await u.doesNotWork();
  } catch (e) {
    console.warn("We expect the next error here, for demonstration.");
    console.error(e);
  }
})();
```

[See it working on CodeSandbox](https://codesandbox.io/s/gifted-jang-k4p2rw?file=/src/index.js).

We're working to update the documentation for MobX-State-Tree, but this is a pretty common complaint about MST, and it's been a pain point in my own day-to-day work. Generators and `flow` are great to understand, but sometimes you really just want to write async code the way you do everywhere else in a modern JavaScript codebase.

## Special thanks

Thanks to [Infinite Red](https://infinite.red/) and their [Ignite boilerplate](https://github.com/infinitered/ignite/issues), which uses this technique. A while back I asked about it, and was very happy to find out that this is possible, so I wanted to make sure to share it with the world.
