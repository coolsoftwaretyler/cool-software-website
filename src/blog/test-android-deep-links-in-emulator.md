---
layout: post
title: "How to test deep links in Android Emulator"
tags: ["post"]
description: 'adb -s emulator-[number] shell am start -W -a android.intent.action.VIEW -d "your://link/here"'
date: 2024-04-02
canonical_url: "https://coolsoftware.dev/blog/test-android-deep-links-in-emulator/"
highlight: React Native
---

Sometimes you want to test out deep links in your Android Emulator. Here's one way to do it. With the emulator open, find its device ID:

```
adb devices
```

Then run

```
adb -s emulator-5554 shell am start -W -a android.intent.action.VIEW -d "walterpicks://nfl/fantasy/my-team" com.walterpicks.picksapp
```

Where emulator-5554 is emulator-[device-id], and where the value in `-d` is your deep link, and the final value is your app's name.

This works for more traditional web links as well:

```
adb -s emulator-5554 shell am start -W -a android.intent.action.VIEW -d "https://get.walterpicks.com/s5lg\?af_xp\=email\&pid\=Email\&c\=March%20Madness%20Deep%20Link\&deep_link_value\=forYou%2Fbrackets\&af_dp\=walterpicks%3A%2F%2Fhome" com.walterpicks.picksapp
```
