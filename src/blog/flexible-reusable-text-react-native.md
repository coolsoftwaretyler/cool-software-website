---
layout: post
title: "Flexible and Reusable Text in React Native"
tags: ["post"]
description: "A technique to keep React Native typography simple and consistent."
date: 2023-12-29
canonical_url: "https://coolsoftware.dev/blog/flexible-reusable-text-react-native/"
highlight: React Native
---

When I build with React Native, I usually write a ton of `<Text />` tags. It's one of the most common things I do. Here's what that usually looks like:

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SampleComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <View style={styles.subContainer}>
        <Text style={styles.subtitle}>This is a sample component.</Text>
        <Text style={styles.bodyText}>
          You can modify this code and start building your own components!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subContainer: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333333",
  },
  bodyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default SampleComponent;
```

Consider the style blocks:

```tsx
const styles = StyleSheet.create({
  // ...
  title: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
    color: "#333333",
  },
  bodyText: {
    color: "#666666",
    fontSize: 16,
    lineHeight: 18
    textAlign: "center",
    paddingHorizontal: 20,
  },
  // ...
});
```

I can't count how many times I have written `fontSize`, `fontWeight`, `lineHeight`, and the rest. Not only do I write those styles a bunch, but I also struggle to remember which values we use for our branding. Are headers 24 units large? Or 28? Is the line height 1.5x the value, or 1? Are we using `poppins` or `poppins-medium`, or wait, is it `poppins-normal`? What's the difference?

## The problem

Each of those questions has an easy and clear answer. But remembering the answers takes up mental space and adds to my cognitive load. Making sure my `styles.textStyle` is consistent with my design language can actually slow me down while I work.

Secondarily, there is some mechanical time it takes for me to write `<Text style={styles.textStyle}>{stuff}</Text>`. And writing to the style blocks all the way at the top or bottom of my text file always takes just a _little_ longer than I'd like it to be.

In isolation, these are small gripes. But when you write enough code day in and day out, these small issues turn into large drains on productivity and results.

## The solution

Since the answers to those questions (what font do I use? what font size do I use? what color? etc.) _rarely change_, we can offload the cognitive burden to TypeScript by writing an custom `<BrandText />` component.

I've adapted this approach from Infinite Red's excellent [Ignite boilerplate](https://github.com/infinitered/ignite), which is the best React Native starter kit that exists.

If you have a new React Native project you haven't yet started, you can honestly stop reading this post, [spin up a new Ignite project](https://www.youtube.com/watch?v=KOSvDlFyg20) and follow their documentation for using their [Text component](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Text.md) and other [built-in components](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Components.md).

If you have an existing project and can't start from a blank slate, read on for advice about adapting Ignite's `Text` component to your own `BrandText` component.

## What Ignite Does

Ignite has a compoennt called `Text`. Here's [what they have to say in their docs about it](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Text.md):

> Ignite's Text Component is an enhanced version of the built-in React Native Text component. It adds internationalization and several useful (and customizable) property presets. You shouldn't need the built-in React Native Text component if you use this. It does everything the built-in one does and more.

> By enhancing the Ignite Text component and using it across your app, you can make sure the right fonts, font weight, and other styles and behaviors are shared across your whole app.

And here's the [actual code](https://github.com/infinitered/ignite/blob/master/boilerplate/app/components/Text.tsx).

When you use Ignite's text component, you can write terser, clearer code. This is faster to write, and easier to understand:

{% raw %}

```tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@components/Text"; // Ignite's `Text` component.

const SampleComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text
        preset="heading"
        text="Hello, React Native!"
        style={{ marginBottom: 20 }}
      />
      <View style={styles.subContainer}>
        <Text
          preset="subheading"
          text="This is a sample component"
          style={{ color: "#333", marginBottom: 10 }}
        />
        <Text
          text="You can modify this code and start building your own components!"
          style={{ color: "#666", paddingHorizontal: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  subContainer: {
    alignItems: "center",
  },
});

export default SampleComponent;
```

{% endraw %}

## What's so good about it?

What I love about this design is that it's consistent by default, but comes with an extensible (and discoverable!) API.

### Ease of use and consistent output

Code like this is easier to understand, easier to write, and you never have to remember the nitty-gritty details of your design system. You can guarantee that every text block will, by default, be on-brand.

### Easy to change

Not only that, but if your design system changes, you can propagate those changes uniformly across your app with changes in the . I guarantee you'll thank yourself later for this one. If you're writing a React Native application, you're going to write a lot of text components, and you can safely predict that this is a good place to apply [DRY (do not repeat yourself) principles](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

### Still very flexible

Notice how the `Text` element will still accept [`StyleProps`](https://reactnative.dev/docs/view-style-props) and apply them. This means you can customize margin, color, or any other style property you want. You can even override the presets as needed.

In addition, Ignite will spread any `TextProps` into the props of the custom component, so you can do things like `adjustsFontSizeToFit`, and any other [Text prop you might need](https://reactnative.dev/docs/text#props).

## My custom text component

Unfortunately, there isn't a good way to only import certain components from Ignite. So you have a few options:

If you have a brand new, or very early project, I recommend you just [start from a fresh Ignite app](https://www.youtube.com/watch?v=KOSvDlFyg20).

If you have an existing project, you can always copy/paste [their code](https://github.com/infinitered/ignite/blob/master/boilerplate/app/components/Text.tsx) into your repository. It's [MIT licensed](https://github.com/infinitered/ignite/blob/master/LICENSE). Huge thanks to Infinite Red for that. Y'all are the best.

Personally, I wanted to tweak the component a little bit. I don't need internationalization support at the moment, and I prefer using React Native's [StyleSheet](https://reactnative.dev/docs/stylesheet) over Infinite Red's convention of writing styles with `$` prefixes. I re-wrote their `Text` component to my own `BrandText` component. Here's a lightweight [Gist](https://gist.github.com/coolsoftwaretyler/5b9c4bf15cdbcc4c5b132a4082b0f767) you can copy/paste or fork for your own purposes.

## Closing thoughts

### DRY vs. AHA programming

I mentioned the [do not repeat yourself (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle early on in this post, and I couldn't find a graceful way to include a caveat about [avoiding hasty abstractions (AHA)](https://kentcdodds.com/blog/aha-programming). I think Kent Dodds has the best approach between duplication/de-deduplication. In this case, I'm certain this abstraction is _not_ hasty at all. I've written many duplicative text styles and props, and felt the pain of migrating a sprawling codebase to a consistent style. And Infinite Red only adds battle-tested code to their boilerplate. I'm sure many of you can relate.

So, this is an instance where we are "pretty confident that you know the use cases for that duplicate code" as Kent says in the AHA article. Even if you're totally new to React Native, I don't think this abstraction is too hasty at all. It's all gravy, as far as I'm concerned.

### Thank you, Infinite Red

The React Native community owes quite a lot to Infinite Red. I hope you consider using their projects and letting them know what you think. [They recently released a docs site collecting their most popular projects](https://shift.infinite.red/introducing-docs-infinite-red-a-new-home-for-infinite-reds-documentation-6f4b25f7a1a4). We should all encourage them and contribute as much as we can. It makes the entire React Native ecosystem healthier.
