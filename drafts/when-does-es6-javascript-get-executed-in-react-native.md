https://snack.expo.dev/@coolsoftwaretyler/es6-module---imported-everywhere?platform=web

https://snack.expo.dev/@coolsoftwaretyler/es6-module---imported-once?platform=web

https://snack.expo.dev/@coolsoftwaretyler/es6-module---imported-in-unused-file

https://stackoverflow.com/questions/36564901/in-the-import-syntax-of-es6-how-is-a-module-evaluated-exactly

Metro bundler: https://facebook.github.io/metro/docs/cli

To get the bundle:

1. Download from Expo
1. `yarn`
1. `expo-cli start`
1. Go to the metro address
1. Find the `bundleUrl` in the response
1. Go to that Url

Things to notice:

1. The console message only shows up once in both of the bundles where it happens
1. You won't find it in the bundle from the unused file
1. You'll also notice that the `Settings` screen function doesn't exist in the unused bundle as well. Metro *never* found it.

Also maybe try to isolate the function in the module and show how it's an IIFE? I'm assuming that's how it works.