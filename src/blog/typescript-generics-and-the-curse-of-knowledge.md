---
layout: post
title: "TypeScript Generics and the Curse of Knowledge"
tags: ["post"]
description: "Where is the line between gatekeeping and developing preferences with experience?"
date: 2024-03-01
canonical_url: "https://coolsoftware.dev/blog/typescript-generics-and-the-curse-of-knowledge/"
highlight: TypeScript
---

_If you came here to learn about generics in depth, this is not the article you want. Consider the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/2/generics.html) or content from educators like [Matt Pocock](https://www.youtube.com/watch?v=dLPgQRbVquo) or [Josh Goldberg](https://www.learningtypescript.com/generics). This article explores my own shifting tastes, and how to reconcile those with my values in software practice._

[TypeScript generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) are a fundamental part of why TypeScript is so powerful. But the way most experienced practitioners write them is confusing to beginners. It's an unwelcoming practice, but over time I have found that I also have a preference for the shorthand. I suspect this comes from the [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge), which happens when a person with more expertise on a topic becomes unable to sympathize with newcomers to the field.

I want to reconcile my personal preferences with my values of creating a welcoming programming community. I'm not really sure how, but here's what I mean.

Consider this TypeScript code:

```ts
function joinArray(array: string[], separator: string): string {
  return array.join(separator);
}

const stringArray: string[] = ["apple", "banana", "orange"];
const result: string = joinArray(stringArray, ", "); // "apple, banana, orange"
```

When you're new to TypeScript, this makes sense. `joinArray` takes an array of strings, and a separator, also a string. It returns another string, the result of `array.join` given a particular separator. It works great for the first time you need a function like `joinArray`, and when your application has a bunch of arrays of strings.

But as you use `joinArray` more and more, you come to find its limitations. What if you have an array of numbers? This won't work!

```ts
function joinArray(array: string[], separator: string): string {
  return array.join(separator);
}

const numberArray: number[] = [1, 2, 3];
const result: string = joinArray(numberArray, ", "); // TS error: Argument of type 'number[]' is not assignable to parameter of type 'string[]'. Type 'number' is not assignable to type 'string'.
```

As an early TS programmer, you might try making two functions. Like this:

```ts
function joinStrings(array: string[], separator: string): string {
  return array.join(separator);
}

function joinNumbers(array: number[], separator: string): string {
  return array.join(separator);
}

const stringArray: string[] = ["apple", "banana", "orange"];
const numberArray: number[] = [1, 2, 3];

const result1: string = joinStrings(stringArray, ", "); // "apple, banana, orange"
const result2: string = joinNumbers(numberArray, ", "); // "1, 2, 3"
```

Ok, that worked... but you probably feel like something's not quite right here. Shouldn't `joinArray` be more flexible? It certainly would be in plain JavaScript. So you go searching for a term you've heard before: "generics". You find out you can write something that satisfies your need to remove repetition. It looks like this:

```ts
function joinArray<T>(array: T[], separator: string): string {
  return array.join(separator);
}

let stringArray: string[] = ["apple", "banana", "orange"];
let result: string = joinArray<string>(stringArray, ", "); // "apple, banana, orange"
```

But WHOA: what the heck is a `<T>`? That looks like magic!

As you learn more about generics, you find `<T>` to be less magical. Educators like [Matt Pocock](https://www.youtube.com/watch?v=dLPgQRbVquo) or [Josh Goldberg](https://www.learningtypescript.com/generics) show you that `<T>` is just an argument to a TypeScript type, much like you have arguments to JavaScript functions. In many cases, people use `T` as a shorthand for `Type`. It allows you to write flexible code that maintains type safety.

The magic is gone, and you're left feeling frustrated with the broader TypeScript community. Aren't parameters supposed to be descriptive? If you had code like this:

```js
function joinArray(a, s) {
  return a.join(s);
}
```

People would remind you that parameter names should be meaningful! And you should consider writing it as:

```js
function joinArray(array, separator) {
  return array.join(separator);
}
```

At this stage in your TypeScript journey, it's maddening that the JavaScript code would be scrutinized, but not so in TypeScript. For me, this felt like a huge let down. I was disappointed in the TypeScript community for such a strange convention. If you refer back to the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/2/generics.html), you'll see they make their parameter clearer:

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

I truly don't know what shifted. Maybe it's just my time maintaining [MobX-State-Tree](https://mobx-state-tree.js.org/intro/welcome), but I sort of came to like the short parameter names. Let's use MST as a real world example that has brought me around to short parameter names.

Consider our `Literal` class:

```ts
// https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/utility-types/literal.ts
export class Literal<T> extends SimpleType<T, T, T> {
  readonly value: T;
  readonly flags = TypeFlags.Literal;

  constructor(value: T) {
    super(JSON.stringify(value));
    this.value = value;
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"]
  ): this["N"] {
    return createScalarNode(this, parent, subpath, environment, initialValue);
  }

  describe() {
    return JSON.stringify(this.value);
  }

  isValidSnapshot(
    value: this["C"],
    context: IValidationContext
  ): IValidationResult {
    if (isPrimitive(value) && value === this.value) {
      return typeCheckSuccess();
    }
    return typeCheckFailure(
      context,
      value,
      `Value is not a literal ${JSON.stringify(this.value)}`
    );
  }
}
```

As compared to the interface of our `Model` class:

```ts
// https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/complex-types/model.ts
interface IModelType<
  PROPS extends ModelProperties,
  OTHERS,
  CustomC = _NotCustomized,
  CustomS = _NotCustomized
> extends IType<
    ModelCreationType2<PROPS, CustomC>,
    ModelSnapshotType2<PROPS, CustomS>,
    ModelInstanceType<PROPS, OTHERS>
  >
```

We use both short, single-letter generic parameters, along with more descriptive names like `PROPS`. And to be honest, the single-letter parameters become easier to read as you get used to them, and the longer names get weird.

So after a while, you start to write your generic parameters with single letters when you can. The [curse of knowledge](https://en.wikipedia.org/wiki/Curse_of_knowledge) strikes you, and you forget just how arcane the single letters look.

Truthfully, I don't know what to do about this. I don't think it makes sense to _always_ type your generic parameters with descriptive names. But I think we are doing some (light) gatekeeping when we show people `<T>` for the first time without any sort of acknowledgement that it's a very bad parameter name.

Maybe this is better:

```ts
/**
 * T is a non-descriptive parameter name,
 * but it allows us to tell dynamically TypeScript about the types we'll be using in `array`.
 *
 * This keeps `joinArray` flexible in its usage
 */
function joinArray<T>(array: T[], separator: string): string {
  return array.join(separator);
}

let stringArray: string[] = ["apple", "banana", "orange"];
let result: string = joinArray<string>(stringArray, ", "); // "apple, banana, orange"
```

Software allows us to communicate with computers, but it's also an exercise in communicating with other people. Where possible, we have to break the curse of knowledge and invite our colleagues in to our codebase as hospitably as possible. Personally, my goal is to be a good "host" when people are reading my code.
