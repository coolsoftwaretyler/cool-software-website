---
layout: post
title: Delete Derived Data in Xcode when React Native Build Fails
tags: ['post']
description: I've started working on a React Native project, and ran into a build issue with a quick fix.
date: 2021-08-16
---

I've recently started working on a pretty fun [React Native](https://reactnative.dev/) project. It's been a great learning experience, full of new learnings. One big thing I'm contending with now is unexpected errors in my Xcode build step for iOS. 
Today I had a strange one. I had worked on the app for about half an hour yesterday without issue. Closed everything down and came back to it one day later, having made no changes to my environment or code. But Xcode *just wouldn't build*. I followed a few of the build errors to [this post about deleting derived data](https://programmingwithswift.com/delete-derived-data-Xcode/). 

So here's how I fixed my problem: 

1. Navigate to **Xcode > Preferences**.
1. Click on the **Locations** tab in the preferences dialog.
1. Locate **Derived Data** and click on the arrow to open its location in finder.
1. Close Xcode, delete the folder via Finder.
1. Reopen Xcode, rebuild everything.

Just a nice litle Fonzy-esque reset to add to your troubleshooting toolbelt.