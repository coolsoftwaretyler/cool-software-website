---
layout: post
title: Add Alternate App Icons to React Native in Xcode
tags: ["post"]
description: This should be all the steps you need to set up alternate app icons with Xcode and React Native. 
date: 2024-07-14 
highlight: React Native 
---

If you're setting up [product page optimization](https://developer.apple.com/app-store/product-page-optimization/) for your React Native app on the App Store, you may decide you want to ship different icons for each variant in your test.

There are lots of [great video tutorials that talk about this](https://www.youtube.com/watch?v=qXp_cwm10SM), but I find they miss a couple of steps. I had to consult [additional videos](https://youtu.be/AT89ofYpWTU?si=xAyp35witsEQ_h-E) to get all the context.

To save you the trouble, I figured I'd write about it in a blog post.

First, you'll need to get your App Icons. The nice thing about this is you just need 1024x1024. You can [let the system automatically scale your icon down from this size](https://developer.apple.com/design/human-interface-guidelines/app-icons#iOS-iPadOS-app-icon-sizes).

Once you have a handful of App Icons ready to go, open Xcode and find your existing image set (if you have one). For many Expo and React Native projects, you probably already have something in the left hand file explorer that says "Images".

If you don't have that, or can't find it, [here is how you can add one, according to the Apple docs](https://developer.apple.com/documentation/xcode/adding-images-to-your-xcode-project#Create-a-new-image-set), along with an image of what it might look like if you already had one.

Once you locate or create an image set, tap the "+" button in the bottom left of the image set panel and upload all of your 1024x1024 images. Give each one a useful name, like `VariantA`, or however you want to refer to them in your product page optimization.

[This YouTube video has a good demonstration of the previous steps](https://youtu.be/AT89ofYpWTU?si=xAyp35witsEQ_h-E).

Once you've added these, you'll need to add the `CFBundleIcons` section to your `Info.plist`. [This video has a great demonstration](https://www.youtube.com/watch?v=qXp_cwm10SM), and yours will maybe look like this:


```xml
<dict>
    <key>CFBundleAlternateIcons</key>
    <dict>
        <key>WP_ios-store-icon_A</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>WP_ios-store-icon_A</string>
            </array>
            <key>UIPrerenderedIcon</key>
            <false/>
        </dict>
        <key>WP_ios-store-icon_B</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>WP_ios-store-icon_B</string>
            </array>
            <key>UIPrerenderedIcon</key>
            <false/>
        </dict>
        <key>WP_ios-store-icon_C</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>WP_ios-store-icon_C</string>
            </array>
            <key>UIPrerenderedIcon</key>
            <false/>
        </dict>
        <key>WP_ios-store-icon_D</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>WP_ios-store-icon_D</string>
            </array>
            <key>UIPrerenderedIcon</key>
            <false/>
        </dict>
    </dict>
</dict>
```

This is an example of the [WalterPicks](https://www.walterpicks.com/) alternate icons I recently set up, where `WP_ios-store-icon_D` matches the file name of `WP_ios-store-icon_D.png` which is what I would have uploaded in the prior steps.

Once you have this, check your `Info` list in Xcode. It should be nicely formatted. If it just shows the raw XML, you're probably missing a closing tag.

Up next, and this is the tricky bit: go to the Build Settings of your app target, and search for a setting called "Include All App Icon Assets". Toggle that to "Yes" if it isn't already on. This was the sneakiest part for me, and it burned an entire day of back and forth builds. I noticed it in [this video](https://www.youtube.com/watch?v=qXp_cwm10SM) and finally figured out why my images weren't showing up.

With all that behind you, the last step is to submit a new build to App Store Connect. Your images won't be available until after review, so you have a chicken-and-egg problem. You'll need to submit the build with all these changes to app store review, and then once it passes, you may have to re-do any product page optimization tests you had in-progress. But at that point, you should be able to select alternate app icons in your store page tests, much like how [this video](https://www.youtube.com/watch?v=qXp_cwm10SM) describes.

I hope that helps you! Or perhaps it will help me again in the future once I've forgotten all of this.

Do not be afraid of Xcode! But do pay attention to the details.