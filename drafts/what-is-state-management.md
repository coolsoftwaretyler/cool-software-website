---
layout: post
title: What is State Management
tags: ["post"]
description: A small post trying to define state management in the clearest, most concise way I can.
date: 2023-09-19
canonical_url: "https://coolsoftware.dev/what-is-state-management/"
highlight: JavaScript
---

If you work as a software engineer in almost any capacity you probably hear about, talk about, and use "state management" on the daily. But perhaps, like me, you wouldn't necessarily be able to explain what "state management" is off the top of your head. Well, here's my attempt to strip away technical jargon and get to the core of something that's near and dear to my heart.

**If you've got some kind of user interface, a state management tool is the code that makes your product look, feel, or behave differently for your users based on what they have done or are doing within the software system**.

Ok, so I don't hate that description, but I think an example would clarify. Let's say you've got a React component that should either be in dark mode or light mode.

You could think of it like two "different" components. Light mode looks like:

```js
import React, { useState } from "react";

function LightModeComponent() {
  // With state management, we would do something here
  const toggleMode = () => {};

  return (
    <div className="lightMode">
      <h1>Light Mode</h1>
      <p>This is the light mode user interface.</p>
      <button onClick={toggleMode}>Switch to Dark Mode</button>
    </div>
  );
}

export default LightModeComponent;
```

And dark mode would look like:

```js
import React, { useState } from "react";

function DarkModeComponent() {
  // With state management, we would do something here
  const toggleMode = () => {};

  return (
    <div className="darkMode">
      <h1>Dark Mode</h1>
      <p>This is the dark mode user interface.</p>
      <button onClick={toggleMode}>Switch to Light Mode</button>
    </div>
  );
}

export default DarkModeComponent;
```

As it stands... these two separate components aren't particularly useful a user. And as an engineer, if you don't have a good state management tool, it's kind of unclear how you would get them to play nicely together.

Ok, so clearly we're going to talk about state management and how it solves the problem. If you're writing React code, one of the easiest places to start is with the [`useState` hook](https://react.dev/reference/react/useState). `useState` is built into the React platform and allows you to store, modify, and read values to represent the different ways your application looks and behaves (this is, functionally, what we might call "state").

With state, you can take your separate components for light mode and dark mode and combine them into a single component that "knows" what it should look like, and can even change itself based on user action (like clicking a button). Like this:

```js
import React, { useState } from "react";

function ModeToggleComponent() {
  // State to track whether the component is in light mode
  const [isLightMode, setIsLightMode] = useState(true);

  // Function to toggle between light and dark mode
  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  // CSS class for styling based on the mode
  const modeClass = isLightMode ? "lightMode" : "darkMode";

  return (
    <div className={modeClass}>
      <h1>{isLightMode ? "Light Mode" : "Dark Mode"}</h1>
      <p>This is the {isLightMode ? "light" : "dark"} mode user interface.</p>
      <button onClick={toggleMode}>
        Switch to {isLightMode ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
}

export default ModeToggleComponent;
```

Cool, right? We've taken two components and made them into one much more versatile component which is easier to update.

In my opinion, there's a bit of a tradeoff in this change. The code is a little harder to reason about. All of a sudden you have to think to yourself "what does this look like in different states?" or "what are the different possible states?". But don't worry, in a system with well architected state, you can express your code in a variety of ways. If you don't like the way the `isLightMode` state gets interpolated in the JSX of these components, you could instead do something like this:

```js
import React, { useState } from "react";
// Assuming you want to use the initial versions we wrote of the components
import LightModeComponent from "./LightModeComponent";
import DarkModeComponent from "./DarkModeComponent";

function ModeToggleComponent() {
  // State to track whether the component is in light mode
  const [isLightMode, setIsLightMode] = useState(true);

  // Function to toggle between light and dark mode
  const toggleMode = () => {
    setIsLightMode(!isLightMode);
  };

  if (isLightMode) {
    return <LightModeComponent handleClick={toggleMode} />;
  } else {
    return <DarkModeComponent handleClikc={toggleMode} />;
  }
}

export default ModeToggleComponent;
```

This blog post isn't about which is better or why. Instead, I want to illustrate two things:

1. We _need_ state to make applications useful, even in their most basic forms.
2. When you plan your state well, decisions about how to write the rest of your code should be decoupled from the implementation of your state.

Ok, so, `useState`, toggle stuff, end of post, right?

lol no.

There is so. much. to. say. about. state.

A lot of people find React's built in state system to be lacking. When your application grows in complexity, `useState` and its friends `useContext` and `useReducer` can sometimes become unwieldy.
