---
layout: post
title: "Hide a Tab Bar with Expo Router and Nested Stacks"
tags: ["post"]
description: "Here's a way you can hide the Tab Navigator tabs on specific screens in Expo Router, useful for nested routes"
date: 2024-01-01
canonical_url: "https://coolsoftware.dev/blog/hide-tab-bar-expo-router-nested-stack/"
highlight: React Native
---

Let's say you're using [Expo Router](https://docs.expo.dev/router/installation/#quick-start) or [React Navigation](https://reactnavigation.org/), and you want to:

1. Use a [Tabs layout](https://docs.expo.dev/router/advanced/tabs/)
2. Nest a [Stack](https://docs.expo.dev/router/advanced/stack/) inside one of the tabs
3. Hide the tab bar when a user navigates to certain routes.

This can be a little tricky.

## The React Navigation Recommendations

The [recommended solution from React Navigation](https://reactnavigation.org/docs/hiding-tabbar-in-screens/) is to nest the tab navigator inside the first screen of the stack instead of nesting the stack inside the tab navigator. Like this:

```js
function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Since [Expo Router is built on top of React Navigation](https://docs.expo.dev/router/introduction/#features), this solution will work for you if you're using Expo Router as well.

## But what if I still want to hide the tabs?

Rearranging the navigation structure doesn't solve your problem if:

1. You want to make the tab bar dismissable by the user.
2. You don't have permission to rearrange the navigation structure for some external reason.
3. Rearranging your navigation structure would introduce some other technical challenge (maybe just a lot of merge conflicts on an existing project)
4. You want the tab bar toggling to be a little fancier than just rendering/not rendering.

If you find yourself in any of those scenarios, here's how you can make the Expo Router/React Navigation tab bar a little more flexible.

## Skip the blog post, I just want the solution

If you just want to poke around some code, I have a sample repository [here](https://github.com/coolsoftwaretyler/expo-router-dynamic-tab-bar-example). You'll want to look at:

1. `app/(fancytabs)` directory - sets up a tab navigator, nested stack, and a screen that will hide the tab bar
2. `components/FancyTabBar.tsx` - wraps the `BottomTabBar` component from `@react-navigation/bottom-tabs` and reads from
3. `context/FancyTabBarContext.tsx` - React [context](https://react.dev/reference/react/useContext) and an associated provider to control the `FancyTabBar` state.

If you just wanted sample code, I hope you find that helpful!

For those of you who want to understand the thinking behind that set up, read on.

## Here's the plan

The fundamental problem isn't really "the tab navigator tab bar doesn't hide itself on nested routes". Instead, the problem is that we want to have _more control over the tab bar_.

So to get more control over our tab bar and its behavior, we can:

1. Set up a custom tab bar component, and use that in the tab navigator, rather than the built-in component.
2. Use React hooks to abstract out control of that custom component.
3. Consume that control logic elsewhere in our codebase.

## Fancy Tab Bar Component

We're going to create a custom component and [pass it to the tab navigator as the `tabBar` prop](https://reactnavigation.org/docs/handling-safe-area/#hiddencustom-header-or-tab-bar).

To keep things simple, we'll just wrap the built-in `BottomTabBar` component and give it a little conditional rendering logic:

```tsx
/**
 * components/FancyTabBar.tsx
 * https://github.com/coolsoftwaretyler/expo-router-dynamic-tab-bar-example/blob/main/components/FancyTabBar.tsx
 */
import React from "react";
// Importing `BottomTabBarProps` allows us to ask for the same types as React Navigation
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useFancyTabBar } from "../context/FancyTabBarContext"; // We'll get to this later

const FancyTabBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps) => {
  const { isTabBarVisible } = useFancyTabBar(); // We'll get to this later

  if (!isTabBarVisible) {
    return null;
  }

  return <BottomTabBar {...props} />;
};

export default FancyTabBar;
```

## Fancy Tab Bar Hook

Up next, we'll need to have a way to tell the `FancyTabBar` whether or not it should render. We need to put something in the `useFancyTabBar` hook. That hook should basically report a boolean value to the component, which we use to either render `null`, or render the React Navigation `BottomTabBar` component (passing in the props from the wrapper component).

Here's a minimal example of how you can write that:

```tsx
/**
 * context/FancyTabBarContext.tsx
 * https://github.com/coolsoftwaretyler/expo-router-dynamic-tab-bar-example/blob/main/context/FancyTabBarContext.tsx
 */
import React, { createContext, useContext, useState } from "react";

const FancyTabBarContext = createContext({
  isTabBarVisible: true,
  hideTabBar: () => {}, // We'll show how to use this function later on
  showTabBar: () => {}, // We'll show how to use this function later on.
});

/**
 * This custom hook will provide the context to its consuming component.
 * This is what we give to the `FancyTabBar` so it can know if it should render or not.
 */
export const useFancyTabBar = () => {
  return useContext(FancyTabBarContext);
};

/**
 * We'll get to this part later on
 */
export const FancyTabBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const value = {
    isTabBarVisible,
    hideTabBar: () => setIsTabBarVisible(false),
    showTabBar: () => setIsTabBarVisible(true),
  };

  return (
    <FancyTabBarContext.Provider value={value}>
      {children}
    </FancyTabBarContext.Provider>
  );
};
```

This file defines a context (FancyTabBarContext) with initial visibility for the tab bar set to true. It provides functions (hideTabBar and showTabBar) to toggle the visibility state. The hook (useFancyTabBar) allows components to access this context, and the exported `FancyTabBarProvider` will allow us to share that visibility values across the app quite easily.

## Fancy Tab Bar Provider

I think the easiest thing to do with the provider is to wrap our root app with it, over in `app/_layout.tsx`. Like this:

{% raw %}

```tsx
/**
 * app/_layout.tsx
 * https://github.com/coolsoftwaretyler/expo-router-dynamic-tab-bar-example/blob/main/app/_layout.tsx
 */

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { FancyTabBarProvider } from "../context/FancyTabBarContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(standardtabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <FancyTabBarProvider>
      <Stack>
        <Stack.Screen name="(standardtabs)" options={{ headerShown: true }} />
        <Stack.Screen name="(fancytabs)" options={{ headerShown: true }} />
      </Stack>
    </FancyTabBarProvider>
  );
}
```

{% endraw %}

Most of the code here comes straight from `create-expo-app`, but notice how we've imported `FancyTabBarProvider` and wrapped our root `Stack` with it. By doing this, any of the child components of that provider (so, our whole app) can get access to values like this:

```ts
const { isTabBarVisible, hideTabBar, showTabBar } = useFancyTabBar();
```

This means the `FancyTabBar` component can read `isTabBarVisible` and react to it, and other parts of our app can hide or show it. Here's how:

## Hiding the Fancy Tab Bar

Inside a nested screen in the tab bar, what we might want to do is set up a `useEffect` hook to hide the tab bar, and make sure that once we un-mount the component, the tabs come back. Here's what that looks like:

```tsx
/**
 * app/(fancytabs)/fancy-stack/fancy-nested-screen.tsx
 * https://github.com/coolsoftwaretyler/expo-router-dynamic-tab-bar-example/blob/main/app/(fancytabs)/fancy-stack/fancy-nested-screen.tsx
 */
import { StyleSheet } from "react-native";
import { Text, View } from "../../../components/Themed";
import { useFancyTabBar } from "../../../context/FancyTabBarContext";
import { useEffect } from "react";

export default function StandardNestedScreen() {
  const { hideTabBar, showTabBar } = useFancyTabBar();

  useEffect(() => {
    hideTabBar();

    // Whatever you return from useEffect runs on unmount, so we can ensure we show the tab bar again.
    return () => {
      showTabBar();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        This nested screen does not show the tab bar, but it technically lives
        nested in the (fancytabs)/fancy-stack folder.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
```

And that's just about it! I really like using this approach. It gives me more control over navigation. I can structure my files and navigators how I want, and you can even hook into the show/hide functions from other UI elements to allow users to dismiss the tabs in certain flows if they want. In some cases, it can be less work than restructuring your navigation. In other cases (like a brand new project), it might be a little extra work, but I find the benefits are usually worth it.

## Smoothing out the user experience

If you run the sample code and check out the fancy nested screen, you'll notice that showing the tab bar again causes a little bit of layout jank. I think we could resolve that by using something like [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) to animate the position of the tab bar, so instead of conditionally rendering `null` or a `BottomTabBar`, we could conditionally set the position of the tabs, and animate it smoothly with Reanimated. I'll leave that as an exercise for the reader.
