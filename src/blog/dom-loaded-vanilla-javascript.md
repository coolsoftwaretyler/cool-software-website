---
layout: post
title: How do I run JavaScript when the DOM is ready - without jQuery?
tags: ["vanilla javascript", 'post']
description: "How to wait for the document to be ready without jQuery"
date: 2019-02-27
---

I often rely on jQuery purely for the `$("document").ready` function - which feels wrong. 

In some cases, I really just want to run some small code when the page is ready. I'd like to do it in vanilla javascript, because these use cases are particularly well suited for vanilla.

Replace the document ready from jQuery with: 

```
document.addEventListener("DOMContentLoaded", function() {
    // Your code to be executed here
});
```