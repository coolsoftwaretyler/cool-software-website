---
layout: post
title: "Flexible and Reusable Text in React Native"
tags: ["post"]
description: "Here's a technique I've learned that keeps my typography simple and consistent"
date: 2023-12-25
canonical_url: "https://coolsoftware.dev/blog/flexible-reusable-text-react-native/"
highlight: React Native
---

When I build with React Native, I find that I write a ton of `<Text />` tags. It's one of the most common things I do. Here's what that usually looks like:

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  }
```

I can't count how many times I have written `fontSize`, `fontWeight`, `lineHeight`, and the rest. Not only do I write those styles a bunch, but I also struggle to remember which values we use for our branding. Are headers 24 units large? Or 28? Is the line height 1.5x the value, or 1? Are we using `poppins` or `poppins-medium`, or wait, is it `poppins-normal`? What's the difference?

## The problem

I have two pain points while programming text elements like that in React Native:

1. The mechanical time it takes for me to write `<Text style={styles.textStyle}>{stuff}</Text>`, and then write the style blocks all the way at the top or bottom of my text file is always just a _little_ longer than I'd like it to be.
2. The cognitive overhead of making sure my `styles.textStyle` is consistent with my design language can actually slow me down while I work.

These are small gripes, but they take up a bunch of my time and mental energy in a given day.

## The solution

I've adapted this method from Infinite Red's excellent [Ignite boilerplate](https://github.com/infinitered/ignite), which is the best React Native starter kit out there. If you have a new React Native project you haven't yet started, I recommend you start there and follow their documentation for using their [Text component](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Text.md) and other [built-in components](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Components.md). The rest of this post is a bit of re-inventing their wheel, but you might find it helpful if you have an existing React Native project and can't start a new Ignite project.

## What Ignite Does

Ignite has a compoennt called `Text`. Here's [what they have to say in their docs about it](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/components/Text.md):

> Ignite's Text Component is an enhanced version of the built-in React Native Text component. It adds internationalization and several useful (and customizable) property presets. You shouldn't need the built-in React Native Text component if you use this. It does everything the built-in one does and more.

> By enhancing the Ignite Text component and using it across your app, you can make sure the right fonts, font weight, and other styles and behaviors are shared across your whole app.

And here's the [actual code](https://github.com/infinitered/ignite/blob/master/boilerplate/app/components/Text.tsx).

When you use Ignite's text component, you can condense that initial code snippet and remove the styles. It would look like this:

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SampleComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text preset="heading" text="Hello, React Native!" />
      <View style={styles.subContainer}>
        <Text preset="subheading" text="This is a sample component" />
        <Text text="You can modify this code and start building your own components!" />
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
    marginBottom: 20,
  },
  subContainer: {
    alignItems: "center",
  },
  subtitle: {
    marginBottom: 10,
    color: "#333333",
  },
  bodyText: {
    color: "#666666",
    paddingHorizontal: 20,
  },
});

export default SampleComponent;
```

## What's so good about it?

In my opinion, this is much nicer to read, much easier to write, and you never have to remember the nitty-gritty details of your design system. You can guarantee that every text block will, by default, be on-brand.

Not only that, but if you find that you've misinterpreted your typography, or if the design changes, you can propagate those changes uniformly across your app by making changes in one central place. I guarantee you that this is something you'll thank yourself for [DRYing up](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Notice how the Ignite `Text` element will receive _any StyleProps_ and apply them. This means you can still customize margin, color, or any other style property you want.

In addition, Ignite will spread any `TextProps` into the props of the object, so you can do things like `adjustsFontSizeToFit`, and any other [Text property you might need](https://reactnative.dev/docs/text).

What I love about this design is that it's consistent by default, but allows for a discoverable API that's fully extensible. It just makes sure you always have a reasonable and robust starting point.

## My custom text component

I don't have apps that need internationalization support at the moment, and I prefer using React Native's [StyleSheet](https://reactnative.dev/docs/stylesheet) over Infinite Red's convetion of writing styles with `$` prefixes. So I have a

Gist: https://gist.github.com/coolsoftwaretyler/5b9c4bf15cdbcc4c5b132a4082b0f767
