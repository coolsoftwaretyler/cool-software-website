---
layout: post
title:  "The Markdown Shortcode Eleventy Plugin"
tags: [eleventy, plugin, 'post']
description: "Why and how I made an Eleventy plugin that adds a universal shortcode for rendering markdown."
date: 2019-12-04
highlight: Open Source
---

## Problem: I want to include markdown snippets in Eleventy

I've been really throwing myself into [Eleventy](https://www.11ty.io/) these days. Whenever I start a new project, I ask: "Can I accomplish this effectively with Eleventy?" If the answer is yes, I immediately get started with it. So far I haven't run into many stumbling blocks.

However, here's a [great feature request to expose markdown-it as a built-in filter](https://github.com/11ty/eleventy/issues/658) for Eleventy. It's something I run into during many of my builds. Often, I want to keep a directory of markdown files somewhere in the `_includes` folder and include them in templates or layouts on an individual basis. 

## Solution: open a pull request

Seeing other people with this same road block inspired me to contribute the code back to Eleventy to make it happen. But as I dove in to start adding this feature, I thought a little bit about the implementation. 

My approach was to use [markdown-it](https://www.npmjs.com/package/markdown-it) as a built-in [universal shortcode](https://www.11ty.io/docs/shortcodes/#universal-shortcodes). But as I was writing it, I started to wonder if my pull request would be essentially creating scope-creep for the Eleventy project.

## Pivot: how about a plugin, instead?

So I pivoted and decided to try it as an [Eleventy plugin](https://www.11ty.io/docs/plugins/) instead. It makes sense that an optional function like this might be better suited as a standalone package that people can opt-in to, rather than adding more code for the Eleventy maintainers to work with. 

To create the plugin, I followed the steps that [Bryan Robinson outlines in this tutorial](https://bryanlrobinson.com/blog/creating-11ty-plugin-embed-svg-contents/). You can [check out my source code to see how](https://github.com/ogdenstudios/eleventy-plugin-markdown-shortcode). 

Essentially, the plugin works as its own `.eleventy.js` file, which gets imported by the Eleventy plugin system. 

In the plugin's `.eleventy.js` file, I require the `markdown-it` package and some filesystem utilities. Then I define and export a `configFunction` function which takes in the existing `eleventyConfig` object, and an `options` object. 

This function instantiates `markdown-it` (using the `options` object, if provided) and [configures the universal shortcode](https://www.11ty.io/docs/shortcodes/) to read the `file` argument and return the markdown `render` option. 

## Using the plugin 

As explained in the [npm documentation](https://www.npmjs.com/package/eleventy-plugin-markdown-shortcode), you can install my plugin to your Eleventy project like so: 

```
npm install eleventy-plugin-markdown-shortcode --save
```

Then configure your project in `.eleventy.js` to add: 

```
const markdownShortcode = require("eleventy-plugin-markdown-shortcode");
module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(markdownShortcode);
};
```

If you want to use that `options` object to configure your `markdown-it` instance, you can pass in [markdown-it configuration](https://www.npmjs.com/package/markdown-it#init-with-presets-and-options)

```
eleventyConfig.addPlugin(markdownShortcode, {
    html: true,
    linkify: true,
});
```

In any template or layout that allows universal shortcodes (Liquid, Nunjucks, Handlebars, or JavaScript), you can quickly include rendered markdown like so: 

```
<% markdown '/path/to/markdown.md' %> // Use { } instead of < > here - I had to substitute out so the liquid tags don't get processed
```

Overall, it was a fun little project, and I hope it's made some peoples' Eleventy projects more convenient. It certainly has, for me. 