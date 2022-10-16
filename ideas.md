Use the new Expo router:
    - https://blog.expo.dev/rfc-file-system-based-routing-in-react-native-7a35474722a
    - Maybe a YouTube video?
    - Go through their major items and set up things I liked/didn't like.

Where should I put javascript functions in my React Native components/screens?
    - if you can, move it to separate helper functions/files
    - think about your code as though it was an npm package - what would be the best API for you?
    - Write your functions like a package

Where should we put team documentation?
    Discovery is hard.

React Native focus
    Accessibility?
    Focus in general?
    Look into Android/iOS and how they handle focus

JSX - how much expression is too much?
    - if/else returns
    - ternary expressions
    - IIFEs to return state
    - Using functions to return state inside a component?
    - https://stackoverflow.com/questions/44046037/if-else-statement-inside-jsx-reactjs

Storing data in React Native
    - https://stackoverflow.com/questions/44376002/what-are-my-options-for-storing-data-when-using-react-native-ios-and-android
    - This is broad - what question do I really want to answer?
    - Scope down to "different persistence options" vs "strategies for client/server"

Environment variables in React Native?
    - What's the best way to manage this? .env? something else?

Hiding the keyboard in react native:
    - https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native

Omnitools and Flashlist
    - Flashlist is awesome, but it comes with some drawbacks
    - Omnitools give you some flexibility for the flashlist items to manipulate
    - Benefits that omnitool can be pulled around the app
    - Consistent UI patterns

JSX uses expressions, not statements

Enjoy what you're doing
    - Gumrunner - do better when you're focused onp laying the game

Do the yak shaving
    - Lots of times dev teams complaints are because they don't do enough Yak shaving


React Native withCredentials
    - ios doesn't work, android does
    - https://reactnative.dev/docs/network#known-issues-with-fetch-and-cookie-based-authentication

Let's say you write your own JavaScript modules and publish them to npm/yarn for use in your React Native application. Pure JS , but sort of "targeting" React Native.
Do you:
Bundle and minify your package
Just bundle, but not minify your package
Do something else
Bonus: what patterns, tools, build step do you use for this kind of work?


Thinking about managing network requests and state
    - MST drives the data
    - React components just check data

M1 issue?

diff --git a/ios/walterpicksmobileapp.xcodeproj/project.pbxproj b/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
index 1cbbcd36..a966fdb7 100644
--- a/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
+++ b/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
@@ -587,7 +587,7 @@
 				COPY_PHASE_STRIP = NO;
 				ENABLE_STRICT_OBJC_MSGSEND = YES;
 				ENABLE_TESTABILITY = YES;
-				"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = i386;
+				"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "arm64 i386";
 				GCC_C_LANGUAGE_STANDARD = gnu99;
 				GCC_DYNAMIC_NO_PIC = NO;
 				GCC_NO_COMMON_BLOCKS = YES;

Things I like about RN
    - No third party marketing tools from GTM

Gum runner
    - Enjoy your work
    - Explore the furthest possibility, but do it quickly
    - Stay alive

Testing MST is hard with RNTL
    - Views - what functions?

Show demo of "living" ES6 imports

Testing with Jest allows you to understand "what is it?" - directly importing your thing, manipulate it, test kt
Uniquely awesome in React Native because everything we have is in JS/TS