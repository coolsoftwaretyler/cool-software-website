---
layout: post
title: "How Does MobX-State-Tree Infer Model Properties?"
tags: ["post"]
description: "A deep dive into the way MobX-State-Tree infers model properties from primitive values."
date: 2023-07-24
canonical_url: "https://coolsoftware.dev/how-does-mobx-state-tree-infer-model-properties/"
highlight: MobX-State-Tree
---

In MobX-State-Tree, you can define model properties in two ways:

## Using explicit types from MST

You can define your model using the explicit `types` functions directly from MobX-State-Tree

```js
import { types } from "mobx-state-tree";

// Declaring the shape of a node with the type `Todo`, which has a `title` property. The value of that property must be a `types.string` - from MST.
const Todo = types.model({
  title: types.string,
});

// Creating a tree based on the "Todo" type, with initial data:
const coffeeTodo = Todo.create({
  title: "Get coffee",
});
```

## Using inferred primitive types

Or you can define your model by providing default values of [primitive types](https://mobx-state-tree.js.org/overview/types#primitive-types) (excluding `types.custom`).

```js
import { types } from "mobx-state-tree";

// Declaring the shape of a node with the type `Todo`, which has a `title` property with a default value
const Todo = types.model({
  title: "Get coffee",
});

// Creating a tree based on the "Todo" type.
const coffeeTodo = Todo.create();

// `coffeeTodo.title` will be the default "Get coffee" value from the model definition
console.log(coffeeTodo.title);
```

When you declare your properties this way, each property will be mapped to its corresponding primitive MobX-State-Tree type, and be wrapped in [`types.optional`](https://mobx-state-tree.js.org/API/#optional). Neat, right? It's all part of MST's [philosophy](https://mobx-state-tree.js.org/intro/philosophy) to provide the best developer experience possible.

## But how does it work?

I was curious about how this type inference works, and it turns out to be a pretty straightforward set of `if...else` statements, all put together in the [`toPropertiesObject` function](https://github.com/mobxjs/mobx-state-tree/blob/7aec7bff78fbcfda7c896358ffb4ed0744578de8/packages/mobx-state-tree/src/types/complex-types/model.ts#L258).

### Input/Output

`toPropertiesObject` is a utility in the [model type](https://github.com/mobxjs/mobx-state-tree/blob/7aec7bff78fbcfda7c896358ffb4ed0744578de8/packages/mobx-state-tree/src/types/complex-types/model.ts) which takes some input that satisfies the `ModelPropertiesDeclaration` interface, and returns an output that satisfies the `ModelProperties` interface.

Input:

```ts
// `toPropertiesObject` will take any key/value pairs where the keys are strings, and the values are either a primitive value, or an MST type
export interface ModelPropertiesDeclaration {
  [key: string]: ModelPrimitive | IAnyType;
}

// `toPropertiesObject` will return key/value pairs where the keys are strings, and the values must be MST types.
export interface ModelProperties {
  [key: string]: IAnyType;
}
```

For these types, it's useful to note that `ModelPrimitive` types look like this:

```ts
export type ModelPrimitive = string | number | boolean | Date;
```

And the IAnyType interface is an extension of MST's Type interface:

```ts
export interface IAnyType extends IType<any, any, any> {}
```

The typing of `IType` is outside the scope of this blog post, but you can read more about the Type interface here: https://github.com/mobxjs/mobx-state-tree/blob/7aec7bff78fbcfda7c896358ffb4ed0744578de8/packages/mobx-state-tree/src/core/type/type.ts#L73

### Control flow

`toPropertiesObject` is called inside the `ModelType` constructor. [You can read about that in a prior blog post I wrote](https://coolsoftware.dev/blog/what-happens-when-you-create-an-mst-model/). The inputs there come from the top-level call to `types.model`, which are also explained in that blog post.

Once we get to the call `toPropertiesObject`, we take our `ModelPropertiesDeclaration` and loop through the keys of the object. For each key:

1. We make sure the user hasn't passed in MST hooks as property keys. MST will throw an error if a property name is `afterCreate`, `afterAttach`, `afterCreationFinalization`, `beforeDetach`, or `beforeDestroy`. This is our way of keeping those model properties reserved.
1. We make sure the user didn't pass a [JavaScript getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) as a property. If they did, we throw an error.
1. We throw an error if the user has passed `null` or `undefined` without any kind of `types.maybe` wrapper to protect it.
1. If a value is a string, number, boolean, or Date, we can infer its type into an `IAnyType` (the focus of this post.)
1. Map types and Array types get converted into reasonable defaults (we default to `{}` and `[]` wrapped in `types.optional`).
1. If the input is already an MobX-State-Tree type (which we check with the [`isType` function](https://mobx-state-tree.js.org/API/index#istype)), we return it as-is.
1. If the value is a function, we will set it as `undefined` in production, and we will throw an error in any environment other than `NODE_ENV === 'production'`
1. If the value is an object, we will set it as `undefined` in production, and we will throw an error in any environment other than `NODE_ENV === 'production'`

Lots of stuff in there! While I was writing up this blog post, I put together some new tests for the MobX-State-Tree repository to exercise most of these scenarios. You can see those [in this PR](#link-here).

### Actually inferring the type

Ok, so that's the high-level overview of the `toPropertiesObject` function. But let's hone in on the step where we actually take something of type `ModelPrimitive` and return an `IAnyType`. We do that in a block of code that looks like this:

```ts
return Object.assign({}, props, {
  [key]: optional(getPrimitiveFactoryFromValue(value), value),
});
```

Where `getPrimitiveFactoryFromValue` is an internal function that looks like:

```ts
export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
  switch (typeof value) {
    case "string":
      return string;
    case "number":
      return number; // In the future, isInteger(value) ? integer : number would be interesting, but would be too breaking for now
    case "boolean":
      return boolean;
    case "object":
      if (value instanceof Date) return DatePrimitive;
  }
  throw fail("Cannot determine primitive type from value " + value);
}
```

That's about it! Essentially, what this block of code says is:

If a value is a string, number, boolean, or Date, return a key/value pair where the key is the key as given, and the value is a MobX-State-Tree `types.optional` wrapped around a MobX-State-Tree `types.string`, `types.number`, `types.boolean`, or `types.DatePrimitive`, with a default value that matches the given value. It's all really just one set of nested `if...else` statements.

## Stuff I learned writing this post

While I was digging through the MobX-State-Tree code to do this write up, here's some things that came to mind:

I ran across the [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-) in TypeScript for the first time. We use it to basically assert to TypeScript that the result of `const descriptor = Object.getOwnPropertyDescriptor(props, key)!` won't be `null` or `undefined`, even though those values _technically_ can come back from that function call.

While I know about [JavaScript getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), I hadn't considered what would happen if a person passed them into a model definition in MST. I think it's very cool that we handle it like that, and either good foresight on the original authors, or good job fixing bugs that could get gnarly.

I've used [TypeScript enums](https://www.typescriptlang.org/docs/handbook/enums.html#handbook-content) before, but haven't really considered [they are real objects that exist at runtime](https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime). This became relevant while I was writing tests to check for all of the `Hook` enum properties, and I wanted to iterate over the values in that enum. You can pretty much just write `const hookValues = Object.values(Hook)` and it works.

Writing tests is an excellent way to read code, get some tactile experience with a codebase, and really test your understanding of a new project - especially an open source library like MobX-State-Tree.

I'm going to need to get much more comfortable reading and interpreting [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) calls. I rarely use this day-to-day, but we make heavy use of it in MobX-State-Tree.

The [`describe`](https://mobx-state-tree.js.org/API/interfaces/ianytype#describe) function is really fun! It's great for testing the shape of a type, rather than just the snapshot of a given tree. I don't use this enough, but I really like the format of its output.

This post [and my previous one on `types.model`](https://coolsoftware.dev/blog/what-happens-when-you-create-an-mst-model/) have been a great way to get acquainted with the codebase, and I'm beginning to see repeated types and interfaces in TypeScript. I think I'm going to begin putting together a visual mind-map of the MobX-State-Tree types, since [we have a lot of open TypeScript issues at the moment](https://github.com/mobxjs/mobx-state-tree/issues?q=is%3Aopen+is%3Aissue+label%3ATypescript), and fixing them up is high priority on the roadmap.
