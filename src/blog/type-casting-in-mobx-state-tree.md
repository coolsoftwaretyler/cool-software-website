---
layout: post
title: "When should I use type casting in MobX-State-Tree?"
tags: ["post"]
description: "A simple rubric for when the cast function is helpful, along with more details about the underlying type inference system of MobX-State-Tree."
date: 2023-09-30
canonical_url: "https://coolsoftware.dev/when-should-i-use-type-casting-in-mobx-state-tree/"
highlight: MobX-State-Tree
---

## Here's the answer

If you don't care about the details why, here's a few examples of where you need to use `cast` in MobX-State-Tree, and where you can get away without it:

### You do not need cast during model instantiation

If you want to instantiate a model with a snapshot, you do not need to `cast` that snapshot. TypeScript is satisfied with this code:

```ts
import { types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    introduction: types.optional(types.string, "Hello,"),
  })
  .views((self) => ({
    get greeting() {
      return `${self.name} ${self.introduction}`;
    },
  }));

const tyler = Person.create({
  name: "Tyler",
  introduction: "ayo",
});

console.log(tyler.greeting);
```

[See it run in CodeSandbox](https://codesandbox.io/s/little-cherry-3mpc5x?file=/src/index.ts)

### You need to cast during model assignment

If you have a parent model with a child model, and you want to assign a snapshot to the child model, TypeScript will require you to cast your snapshot. This code triggers a TypeScript error:

```ts
import { types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    introduction: types.optional(types.string, "Hello,"),
  })
  .views((self) => ({
    get greeting() {
      return `${self.introduction} ${self.name} `;
    },
  }));

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    changeCoolestPerson() {
      // This is a TypeScript error because type inference is looking for a strict match
      self.coolestPerson = { name: "Jamon", introduction: "sup" };
    },
  }));

// No TypeScript error here because type inference is a little more relaxed in model creation
const rootStore = RootStore.create({
  coolestPerson: { name: "Tyler", introduction: "ayo" },
});

console.log(rootStore.coolestPerson.greeting);

rootStore.changeCoolestPerson();

console.log(rootStore.coolestPerson.greeting);
```

[See the error here](https://codesandbox.io/s/agitated-bhaskara-qzvysd?file=/src/index.ts)

To fix it, all you need to do is use `cast` on line 21, like so:

```ts
import { cast, types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    introduction: types.optional(types.string, "Hello,"),
  })
  .views((self) => ({
    get greeting() {
      return `${self.introduction} ${self.name} `;
    },
  }));

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    changeCoolestPerson() {
      // Cast assures TypeScript we believe the snapshot is compliant with the inferred type.
      self.coolestPerson = cast({ name: "Jamon", introduction: "sup" });
    },
  }));

const rootStore = RootStore.create({
  coolestPerson: { name: "Tyler", introduction: "ayo" },
});

console.log(rootStore.coolestPerson.greeting);

rootStore.changeCoolestPerson();

console.log(rootStore.coolestPerson.greeting);
```

[See the fix here](https://codesandbox.io/s/focused-thunder-7ykymw?file=/src/index.ts)

### You do not need to cast if you assign a model that only has properties

Due to a quirk in the type inference system for MST, a properties-only model will have an inferred TypeScript type that matches a snapshot. So if you remove the `views` from `Person`, this is valid with no TypeScript errors:

```ts
import { types } from "mobx-state-tree";

const Person = types.model({
  name: types.string,
  introduction: types.optional(types.string, "Hello,"),
});

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    changeCoolestPerson() {
      // No TypeScript error because the snapshot matches the inferred type of Person
      self.coolestPerson = { name: "Jamon", introduction: "sup" };
    },
  }));

const rootStore = RootStore.create({
  coolestPerson: { name: "Tyler", introduction: "ayo" },
});

console.log(rootStore.coolestPerson.name);

rootStore.changeCoolestPerson();

console.log(rootStore.coolestPerson.name);
```

[No errors here](https://codesandbox.io/s/nifty-monad-x5wr3d?file=/src/index.ts)

This is not an exhaustive list of the scenarios where you migth want `cast`, but I think these are representative of the fundamental principle. You need `cast` in scenarios where TypeScript is looking for the full inferred type for a MobX-State-Tree type, and you want to use a snapshot. If you just came here to see some code samples and figure out when to use/not use `cast`, you can stop here and hopefully that'll clear things up for you.

If you want to read more about why, continue on!

## TypeScript and MobX-State-Tree

Before we get started, I just want to acknowledge that writing about TypeScript and MobX-State-Tree can get a little confusing, because there are the "types" provided by TypeScript, and then there is `types` - the top level export from the MobX-State-Tree library. When I write about these things, I will either say "TypeScript type(s)" or "TS type(s)" to refer to TypeScript-level things, and "MobX-State-Tree type(s)" or "MST type(s)" to refer to something from the `types` part of the MST library. Hopefully that helps keep things straight, but if you have any questions, [reach out to me on Twitter](https://twitter.com/coolsoftwaredev) or [GitHub](https://github.com/mobxjs/mobx-state-tree/discussions).

## Easy Type Inference

In the beginning of this post, I made reference to a term, "type inference". This is the way that MobX-State-Tree connects to your own code to let the TypeScript compiler know whether or not the things you've written satisfy its internal typing rules. Here's some example code that demonstrates a very simple kind of type inference that works quite smoothly with MST and TypeScript out of the box.

```ts
import { types } from "mobx-state-tree";

const needsAString = (s: string) => {
  return s;
};

const stringInstance = types.string.create("hello");

const stringResult = needsAString(stringInstance);

console.log(stringResult);
```

In this example, we define a function, `needsAString`, which requires a `string` as its input. And we create an instance of the [MST primitive type](https://mobx-state-tree.js.org/overview/types), `types.string` with the value `"hello"`. Then we pass the `stringInstance` to `needsAString`, which just returns the input back to us. TypeScript is very happy with us when we do this. You can see the code in a TypeScript environment here: https://codesandbox.io/s/optimistic-fire-nn8r2h?file=/src/index.ts.

## More Complex Type Inference

Of course, most people don't use MobX-State-Tree just to wrap their strings, numbers, and booleans. Most folks are using it to model complex data, and they tend to do that with the MST complex type, `types.model`. Here's an example with slightly more advanced usage:

```js
import { types } from "mobx-state-tree";

const sayHello = (p) => {
  console.log(`${p.greeting} ${p.name}`);
};

const Person = types.model({
  name: types.string,
  greeting: types.optional(types.string, "Hello"),
});

const tyler = Person.create({
  name: "Tyler",
  greeting: "ayo",
});

sayHello(tyler);
```

This code creates a function called `sayHello`, which takes an argument, `p`, and assumes it will have a `greeting` and `name` field, and then logs that o the console.

We define a `Person` model with those properties, and pass an instance of `Person` to the `sayHello` function. If you aren't using TypeScript, this is perfectly sufficient and works exactly as expected.

But what about TypeScript? How should we type the `p` parameter to `sayHello`? If we leave it as-is, TypeScript will complain about it [see here in CodeSandbox](https://codesandbox.io/s/sad-waterfall-ks29xr?file=/src/index.ts).

Fortunately, if we define a [TypeScript interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) that the `Person` model would satisfy, we can use that. Here's what I mean:

```ts
import { types } from "mobx-state-tree";

interface IPerson {
  name: string;
  greeting: string; // Notice this is not optional. We use a `types.optional` in the MST definition, but there's *always* a greeting due to the defaults.
}

const sayHello = (p: IPerson) => {
  console.log(`${p.greeting} ${p.name}`);
};

const Person = types.model({
  name: types.string,
  greeting: types.optional(types.string, "Hello"),
});

const tyler = Person.create({
  name: "Tyler",
  greeting: "ayo",
});

sayHello(tyler);
```

[You can see that TypeScript is happy with this in CodeSandbox](https://codesandbox.io/s/vigilant-rhodes-6rfz99?file=/src/index.ts). In this case, TypeScript is able to _infer_ that `tyler`, an instance of `Person` (an MST model type), satisfies the interface for `IPerson`. This is a slightly more useful version of type inference - I think it looks a little more like a real MST program (if you squint your eyes a little).

## Realistic Type Inference

Ok, those first two examples were kind of hand-wavy on purpose. I wanted to write straightforward code to establish a baseline about how TypeScript and MobX-State-Tree collaborate together to understand both types of types (say that ten times fast) in your program.

But most people still don't write MST exactly like that. For the most part, folks are using MST as a state management system inside JavaScript apps. The conventional pattern is to have something called a `RootStore`, with nested `types.model` declarations in its properties. Here's what I mean:

```ts
import { types } from "mobx-state-tree";

const Person = types.model({
  name: types.string,
  greeting: types.optional(types.string, "Hello"),
});

const tyler = Person.create({
  name: "Tyler",
  greeting: "ayo",
});

const RootStore = types
  .model({
    veryCoolPeople: types.array(Person),
  })
  .views((self) => ({
    get listOfVeryCoolPeople() {
      return self.veryCoolPeople.map((p) => p.name);
    },
  }));

const rootStore = RootStore.create({
  veryCoolPeople: [tyler],
});

console.log(rootStore.listOfVeryCoolPeople);
```

In this example, the `RootStore` model knows about an array (the special MST array type, `types.array`) of `People` models, and has a [computed property](https://mobx-state-tree.js.org//intro/getting-started#computed-properties) that returns an array of strings, which we pull from the `name` attribute on the `Person` model (or rather, a mapping of `.name` properties from the array of `veryCoolPeople`)

You can see this code [here](https://codesandbox.io/s/funny-bardeen-qc3zdc?file=/src/index.ts), and what's very cool is that this is compliant with TypeScript. If you hover over the `p` argument in `listOfVeryCoolPeople` in CodeSandbox, you'll see:

```
(parameter) p: {
    name: string;
    greeting: string;
} & NonEmptyObject & IStateTreeNode<IModelType<{
    name: ISimpleType<string>;
    greeting: IOptionalIType<ISimpleType<string>, [undefined]>;
}, {}, _NotCustomized, _NotCustomized>>
```

It's a little confusing to read, but for now, concentrate on the fact that **this is TypeScript type information, inferred by TypeScript, supplied by MobX-State-Tree types, all without even needing to define an interface.** We get that for free when we're working within MobX-State-Tree itself. This is very cool.

If you changed `listOfVeryCoolPeople` to read `p.firstName`, you'd get both a runtime error _and_ a TypeScript error, since TS knows `firstName` is not a property on the `Person` MST type (or its inferred TypeScript type). [See that here](https://codesandbox.io/s/distracted-tess-vmrr3v?file=/src/index.ts). You'll get an error like:

`Property 'firstName' does not exist on type '{ name: string; greeting: string; } & NonEmptyObject & IStateTreeNode<IModelType<{ name: ISimpleType<string>; greeting: IOptionalIType<ISimpleType<string>, [undefined]>; }, {}, _NotCustomized, _NotCustomized>>'.ts(2339)`

## Type Casting in MobX-State-Tree

Let's get back to the original purpose of the post, now that we've seen straightforward type inference examples. What if you're using [snapshots](https://mobx-state-tree.js.org/concepts/snapshots#docsNav) to create or modify those internal models in a store?

```ts
import { types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    greeting: types.optional(types.string, "Hi"),
  })
  .actions((self) => ({
    makeGreetingMoreFormal() {
      self.greeting = "Hello";
    },
  }));

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    setCoolestPerson() {
      // TypeScript doesn't like this
      self.coolestPerson = { name: "Jamon", greeting: "sup" };
    },
  }));

const rootStore = RootStore.create({
  // TypeScript will allow for this
  coolestPerson: { name: "Tyler", greeting: "ayo" },
});
```

If you [check this in CodeSandbox](https://codesandbox.io/s/quiet-fire-8d33x9?file=/src/index.ts), you'll see an error in `setCoolestPerson`, but not one in the `RootStore.create` call.

### How to fix TypeScript errors in MobX-State-Tree snapshot assignments

Ok, so the quick fix here is to use [`cast`](https://mobx-state-tree.js.org/API/#cast), like we already covered in the beginning of the post:

```ts
import { cast, types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    greeting: types.optional(types.string, "Hi"),
  })
  .actions((self) => ({
    makeGreetingMoreFormal() {
      self.greeting = "Hello";
    },
  }));

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    setCoolestPerson() {
      self.coolestPerson = cast({ name: "Jamon", greeting: "sup" });
    },
  }));

const rootStore = RootStore.create({
  coolestPerson: { name: "Tyler", greeting: "ayo" },
});
```

This will resolve the TypeScript error. You can see that in [CodeSandbox](https://codesandbox.io/s/late-glitter-2536ql?file=/src/index.ts)

p### Why Does It Seem Inconsistent?

If you hover over the `RootStore.create` call for `coolestPerson`, TypeScript will say:

```
(property) coolestPerson: {
    name: string;
} & Partial<ExtractCFromProps<{
    name: ISimpleType<string>;
    greeting: IOptionalIType<ISimpleType<string>, [undefined]>;
}>> & NonEmptyObject
```

But if you hover over `self.coolestPerson`, you'll see:

```
(property) coolestPerson: {
    name: string;
    greeting: string;
} & NonEmptyObject & {
    makeGreetingMoreFormal(): void;
} & IStateTreeNode<IModelType<{
    name: ISimpleType<string>;
    greeting: IOptionalIType<ISimpleType<string>, [...]>;
}, {
    makeGreetingMoreFormal(): void;
}, _NotCustomized, _NotCustomized>>
```

This is where the rubber meets the road. If you haven't read [my post on model creation](https://coolsoftware.dev/blog/what-happens-when-you-create-an-mst-model/), you might want to dig in there for more details, but essentially, calling `RootStore.create({coolestPerson: {name: 'Tyler', greeting: 'ayo'}})` tells TypeScript that we're going to be using a `ModelCreationType`, which extends the type `ExtractCFromProps`, which in tern is an extension of the `ModelProperties` type, which doesn't care about actions or views.

But when we are _inside the model_, TypeScript will infer more exactly that we're looking for something with a method called `makeGreetingMoreFormal`. The JSON snapshot _does not include this method_. But we know at runtime, MobX-State-Tree will populate that action, so we call `cast` to assure TypeScript that the snapshot _will_ satisfy the types.

Importantly, `cast` doesn't really _do_ anything itself. It just re-types the input like so:

```ts
export function cast(snapshotOrInstance: any): any {
  return snapshotOrInstance as any;
}
```

This is really just a convenient wrapper around `as any`, which you could do yourself like so:

```ts
import { types } from "mobx-state-tree";

const Person = types
  .model({
    name: types.string,
    greeting: types.optional(types.string, "Hi"),
  })
  .actions((self) => ({
    makeGreetingMoreFormal() {
      self.greeting = "Hello";
    },
  }));

const RootStore = types
  .model({
    coolestPerson: Person,
  })
  .actions((self) => ({
    setCoolestPerson() {
      // Using `as any` is basically the same as `cast` here, and satisfied TypeScript.
      self.coolestPerson = { name: "Jamon", greeting: "sup" } as any;
    },
  }));

const rootStore = RootStore.create({
  coolestPerson: { name: "Tyler", greeting: "ayo" },
});
```

[Check it out in CodeSandbox](https://codesandbox.io/s/sharp-bardeen-6gzfpz?file=/src/index.ts)

## Stuff I learned writing this post

1. I need to go through and do a deep dive on `actions` and `views` in MobX-State-Tree. I mentioned this in my [post about model creation](https://coolsoftware.dev/blog/what-happens-when-you-create-an-mst-model/), but there are important implications of those methods, and the way they interact with the TypeScript system has far-reaching implications.
2. I don't think we're particularly clear with people about when and where they want to use type casting functions. I hope this blog post helps improve that, but we need better docs about TypeScript inference overall.
3. MobX-State-Tree types for generics follow very winding chains of type information that can be challenging to decipher, but if you follow the breadcrumbs, you can usually figure out what TypeScript expects from you. It takes some extra effort, but may improve your overall understanding of both MobX-State-Tree and TypeScript
