---
layout: post
title: "Leetcode problem: Encode and Decode TinyURL"
tags: [leetcode, 'post']
description: "A medium-level leetcode problem"
date: 2019-12-13
---

This came up in my Leetcode weekly email, and it's one I saw during a job interview once and failed. I wanted to take a crack at it again in a more controlled environment. 

## Problem description

[Problem on leetcode](https://leetcode.com/problems/encode-and-decode-tinyurl/)


TinyURL is a URL shortening service where you enter a URL such as https://leetcode.com/problems/design-tinyurl and it returns a short URL such as http://tinyurl.com/4e9iAk.

Design the encode and decode methods for the TinyURL service. There is no restriction on how your encode/decode algorithm should work. You just need to ensure that a URL can be encoded to a tiny URL and the tiny URL can be decoded to the original URL.

## Solution 

I'm pretty sure I can use [Base64 encoding](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding) for this. It's not something I could have reasoned about, I've just read about it before and know I can use it. 

I think I can Base64 encode the input url and return it appended to `http://tinyurl.com/`, and then take `http://tinyurl.com/[some-encoded-string]` and decode the relative path back. 

Here's how I would express that in JavaScript:

```
var encode = function(longUrl) {
    let encodedUrl = Buffer.from(longUrl, 'binary').toString('base64');
    return "http://tinyurl.com/" + encodedUrl;
};

var decode = function(shortUrl) {
    let encodedUrl = shortUrl.split('tinyurl.com/')[1];
    return Buffer.from(encodedUrl, 'base64').toString();
};
```

It works! 

Note: I had to use Buffers instead of the straight methods since Leetcode is running Node, not browser-js. [Here's a StackOverflow about it](https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error?noredirect=1).

Honestly, I only failed this years ago because I just didn't know about Base64 encoding. Hopefully now you know about it and can use it. 