The TypeScript implications of MobX-State-Tree can be a little confusing. There are a lot of reasons for this, but I think one major reason is because the `mobx-state-tree` npm package has a top-level named export called `types`, which is _not_ really anything related to the TypeScript implementation in MST.

However, `types` is basically the most common thing people import from MobX-State-Tree, and it's kind of the whole reason you would even look to use the package. Our whole `model` type comes from this export. And if you're using TypeScript alongside MST, the confusion basically starts the moment you start using `types`.

We're working to improve that, but for the time being, I wanted to do a write up about some utility functions we provide that might make your MobX-State-Tree and TypeScript integration a little nicer.

## But first, type inference

First, let's talk about type inference. Here's some example code you would basically never write, but that demonstrates a very simple kind of type inference that works quite smoothly:

```ts
import { types } from "mobx-state-tree";

const needsAString = (s: string) => {
  return s;
};

const stringInstance = types.string.create("hello");

const stringResult = needsAString(stringInstance);

console.log(stringResult);
```

In this example, we define a function, `needsAString`, which requires a `string` as its input. And we create an instance of a `types.string` (the MST primitive type) with the value `"hello"`. Then we pass the `stringInstance` to `needsAString`, and get it back. TypeScript is very happy with us when we do this. You can see that here: https://codesandbox.io/s/optimistic-fire-nn8r2h?file=/src/index.ts

This is a very basic example of what I mean when I say "type inference". MobX-State-Tree has a whole
