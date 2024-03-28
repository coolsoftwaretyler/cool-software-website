---
layout: post
title: "How to test deep links in iOS Simulator"
tags: ["post"]
description: "xcrun simctl openurl booted myapp://link-path"
date: 2024-03-28
canonical_url: "https://coolsoftware.dev/blog/test-ios-deep-links-in-simulator/"
highlight: React Native
---

Sometimes you want to test out deep links in your iOS simulator. Here's a [reference](https://www.iosdev.recipes/simctl/#opening-a-url-on-a-simulator), and here's one way to do it:

```
xcrun simctl openurl booted walterpicks://nfl/fantasy/my-team
```

This will work if you're registered with an http address as well:

```
xcrun simctl openurl booted https://get.walterpicks.com/s5lg\?af_xp\=email\&pid\=Email\&c\=March%20Madness%20Deep%20Link\&deep_link_value\=forYou%2Fbrackets\&af_dp\=walterpicks%3A%2F%2Fhome
```
