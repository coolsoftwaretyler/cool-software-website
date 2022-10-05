---
layout: post
title: Testing React Native WebView with React Native Testing Library
tags: ['post']
description: How to test React Native Webview with React Native Testing Library
date: 2022-09-07
highlight: React Native
---

Let's say you've got a React Native project, you're using [React Native Testing Library](https://callstack.github.io/react-native-testing-library/), and you're trying to test a component that uses[ React Native WebView](https://github.com/react-native-webview/react-native-webview).

Your component might look a little bit like this:

```js
// In App.js
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const injectedJavaScript = `(function() {
  const title = document.title
  window.ReactNativeWebView.postMessage(title);
})()`;

export default function App() {
  const [webPagetitle, setWebPageTitle] = useState("");

  const handleMessage = (event) => {
    setWebPageTitle(event.nativeEvent.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView
          source={ uri: "https://gitlab.com/coolsoftwaretyler" }
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
          testID="webview"
        />
      </View>
      <View style={styles.infoPane}>
        <Text>The title tag of this website is: {webPagetitle}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  webviewContainer: {
    flex: 1,
    width: "100%",
  },
  infoPane: {
    flex: 1,
    justifyContent: "center",
  },
});
```

This example is trivial, but it's a common pattern:  using React Native WebView to execute some JavaScript with `injectedJavaScript`, and handling messages from the browser with the `onMessage` prop, which then go on to modify your application state.

But testing this behavior can be tricky with React Native Testing Library. You might start by writing something like this:

```js
// In App.spec.js
import { render, screen } from "@testing-library/react-native";
import App from "./App";

describe("The application", () => {
  it("should display the title of the web page", () => {
    render(<App />);
    const title = screen.getByText(
      "The title tag of this website is: Tyler Williams · GitLab"
    );
    expect(title).toBeTruthy();
  });
});
```

If you test that out, it'll fail:

```sh
 FAIL  ./App.spec.js
  The application
    ✕ should display the title of the web page (73 ms)

  ● The application › should display the title of the web page

    Unable to find an element with text: The title tag of this website is: Tyler Williams · GitLab

       5 |   it("should display the title of the web page", () => {
       6 |     render(<App />);
    >  7 |     const title = screen.getByText(
         |                          ^
       8 |       "The title tag of this website is: Tyler Williams · GitLab"
       9 |     );
      10 |     expect(title).toBeTruthy();

      at Object.<anonymous> (App.spec.js:7:26)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.581 s, estimated 2 s
Ran all test suites related to changed files.
```

The problem is that the WebView isn't really getting rendered, at least, not in a phone simulator. So it won't have actual access to the web, and it can't execute its injected JavaScript, or do any of the things we expect.

## So how do we test React Native WebView, then?

If you're just looking for the answer - here it is:

```js
// In App.spec.js
import { render, screen } from "@testing-library/react-native";
import { fireEvent } from "@testing-library/react-native/build";
import App from "./App";

describe("The application", () => {
  it("should display the title of the web page", () => {
    render(<App />);

    const webview = screen.getByTestId("webview");

    fireEvent(webview, "message", {
      nativeEvent: { data: "Tyler Williams · GitLab" },
    });

    const title = screen.getByText(
      "The title tag of this website is: Tyler Williams · GitLab"
    );

    expect(title).toBeTruthy();
  });
});
```

Hopefully that'll help you out if you don't know how to test React Native WebView with React Native Testing Library. To mock out those events we expect to happen in real usage, you'll need to find the webview in the component, and call `fireEvent` with it, along with your expected values for the event.

Here's a little more documentation about `fireEvent`: https://callstack.github.io/react-native-testing-library/docs/api/#fireevent

## Ok, but why doesn't it just work?

Let's dig in a little bit about what all is going on here.

React Native Testing Library is built on top of [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) ([here's a really great video if you prefer to watch demos about how things work](https://www.youtube.com/watch?v=JKOwJUM4_RM)).

These libraries provide a rendering environment for your React Native code. So unlike something like [Detox](https://github.com/wix/Detox), which runs in a simulator/emulator and "drives" your app - RNTL reads your JavaScript files and renders your components virtually.

They provide a really helpful utility called `screen.debug()` which you can call any time after calling the `render` function. It will spit out a log of what RNTL has rendered virtually (i.e., "What do my tests see?").

Here's the output of `screen.debug()` if we were to call it from these examples:  

```js
  <RCTSafeAreaView
      emulateUnlessSupported={true}
      style={
        Object {
          "alignItems": "center",
          "backgroundColor": "#fff",
          "flex": 1,
          "justifyContent": "center",
        }
      }
    >
      <View
        style={
          Object {
            "flex": 1,
            "width": "100%",
          }
        }
      >
        <View
          style={
            Array [
              Object {
                "flex": 1,
                "overflow": "hidden",
              },
              undefined,
            ]
          }
        >
          <RNCWebView
            cacheEnabled={true}
            injectedJavaScript="(function() {
      const title = document.title
      window.ReactNativeWebView.postMessage(title);
    })()"
            injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
            injectedJavaScriptForMainFrameOnly={true}
            javaScriptEnabled={true}
            messagingEnabled={true}
            onContentProcessDidTerminate={[Function anonymous]}
            onHttpError={[Function anonymous]}
            onLoadingError={[Function anonymous]}
            onLoadingFinish={[Function anonymous]}
            onLoadingProgress={[Function anonymous]}
            onLoadingStart={[Function anonymous]}
            onMessage={[Function anonymous]}
            onShouldStartLoadWithRequest={[Function anonymous]}
            source={
              Object {
                "uri": "https://gitlab.com/coolsoftwaretyler",
              }
            }
            style={
              Array [
                Object {
                  "flex": 1,
                  "overflow": "hidden",
                },
                Object {
                  "backgroundColor": "#ffffff",
                },
                undefined,
              ]
            }
            testID="webview"
            textInteractionEnabled={true}
            useSharedProcessPool={true}
          />
        </View>
      </View>
      <View
        style={
          Object {
            "flex": 1,
            "justifyContent": "center",
          }
        }
      >
        <Text>
          The title tag of this website is: 
        </Text>
      </View>
    </RCTSafeAreaView>
```

Neat, right? You can sort of get a sense of how our `App.js` file translates to this, and how an app might render it.

But importantly, look how all the tags are still things like `RCTSafeAreaView` and View and `RNCWebView` and Text. Those aren't the real native components. They are still the JavaScript abstractions of the native components that React Native creates when it's running on device.

That means that our the `RNCWebView` you see there is just some JavaScript object. It doesn't really have access to the web. But it does have access to the props we gave it, such as `onMessage`.

Because of that, we can't actually expect this virtual rendering to hit the website we expect. But we can ask it to "pretend" that it's received whatever would trigger it to fire the `onMessage` event.

That's why, in the passing test, we write these lines:

```js
const webview = screen.getByTestId("webview");

fireEvent(webview, "message", {
  nativeEvent: { data: "Tyler Williams · GitLab" },
});
```

Here, we use a `testID` prop to locate the WebView we want to test. Then we store what we found in the `webview` constant, and we pass that as an argument to the `fireEvent` function from React Native Testing Library, which tells the virtual representation to act as if the message event has been fired, which would call the `onMessage` prop, if we were executing inside an actual device.

## Concluding thoughts

Hopefully you found this article helpful. The first time I tried to test React Native WebView with RNTL, I got stuck on it, because I couldn't wrap my head around "how do I make this fake webview behave as though it really did something in the web page?". `fireEvent` solved the problem, but the important thing here is understanding what's happening in the RNTL environment, and how to manipulate is as though we are using the app in a real device.

This kind of testing won't give you 100% data fidelity. We're mocking out behavior that isn't necessarily always going to work. To get more confidence in our tests, we probably want to:

1. Mock out scenarios that emulate errors in the WebView
1. Write some Detox tests (or other end-to-end tests) that drive the app in a real simulator/emulator environment
1. Have a QA team/check ourselves on real devices.

But if you're doing test-driven development, or even just trying to add some basic assurance to your codebase, React Native Testing Library is extremely fast. That test runs in less than 2 seconds on my machine, whereas the other methods all have extremely long feedback loops. This means I can keep the tests running with `yarn test --watch` and make sure I don't accidentally break existing functionality. It also means I can run my tests in CI for cheap, and without making pipelines run forever.

The tradeoff of mocks is that we may end up with some false positives (tests that pass because we gave them ideal scenarios). But we can iterate faster on tests than we normally would, and that gives a higher degree of confidence in making change. Combined with additional QA processes, React Native Testing Library is a powerful tool for any React Native team.

If you want to play around with this code, I've made an example repository over at [https://gitlab.com/coolsoftwaredev/rn-webview-testing-example](https://gitlab.com/coolsoftwaredev/rn-webview-testing-example).