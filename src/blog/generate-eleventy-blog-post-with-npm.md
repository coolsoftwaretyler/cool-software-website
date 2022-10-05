---
layout: post
title: 'Generate Eleventy Blog Posts with an NPM Script'
tags: ['post']
description: 'Save time creating blog posts with a quick node script'
date: 2020-02-07
highlight: Web Development
---

My [personal website](https://ogdenstudios.xyz) is built with [Eleventy](https://www.11ty.dev/). Each blog post is a markdown file in the directory `src/blog`. They all have some [front matter](https://www.11ty.dev/docs/data-frontmatter/) to provide post-specific data.

I have a redundant process for creating new posts. Every time I start a new blog I:

1. Open up the folder, 
2. choose a random post,
3. copy the post contents to my clipboard,
4. manually create a new markdown file with the blog title,
5. paste my clipboard into the file,
6. scrub the front matter contents,
7. delete the post contents,
8. write the new blog post. 

It's a simple process, nothing too technical. But by doing it manually, I run into two problems: 

1. I waste time. 
2. I make mistakes (and waste time correcting them)

Since I do this process often, it rarely changes, and it often wastes my time, it's a great candidate for automation. So I wrote a node script.

## The goal 

I wanted to be able to run something like `npm run newpost name-of-blog-post` and get a blank markdown file with the correct file name in the blog posts folder.

## Writing the script

I created a directory called `scripts/` in my site repository. In it, I created a file called `newPost.js`. 

Then in `package.json`, I set up the script to run this file like so:

```json
"scripts": {
    . . .
    "newpost": "node ./scripts/newPost.js"
    . . .
}
```

Inside `scripts/newPost.js`, I wrote:

```js
const fs = require('fs')
const path = require('path');
const title = process.argv[2];

newPost();

function newPost() {
    const filePath = generateFilePath(title);
    const content = generateContent();
    fs.writeFile(filePath, content, { flag: 'w+' }, (err) => {
        if (err) return console.log(err);
        console.log(`Created ${filePath}`);
    });
}

function generateFilePath(title) {
    return path.join(__dirname, '..', 'src', 'blog', `${title}.md`);
}

function generateContent() {
    return "---\nlayout: post\ntitle: \ntags: ['post']\ndescription:\ndate:\n---";
}
```

## How it works 

This script runs the `newPost()` function, which generates a new file based on the `title` argument provide by the command line. It writes my boilerplate front matter to that file. Then I can navigate to the blank file and get started on my new blog post.

### newPost

`newPost()` generates a file path with the `generateFilePath()` function. It passes in `title`, which I access from the [Node process module](https://nodejs.org/docs/latest/api/process.html#process_process_argv). 

Then it retrieves content from the `generateContent()` function. 

Next, it uses the [Node file system module](https://nodejs.org/api/fs.html) to write that content to the generated file path. If there are any errors, it logs them. Otherwise, it logs the path to the newly created file. 

### generateFilePath

`generateFilePath()` uses the [Node path module](https://nodejs.org/api/path.html) to write my relative file path, [interpolating](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) the `title` argument. 


### generateContent

`generateContent()` returns a string with my boilerplate front matter as it stands. I didn't necessarily *need* to write a separate function for this. But I figured eventually I may have more complex logic for figuring out what goes in different types of posts. I wanted to make it extensible for the future. 

## Thanks, Eleventy!

Something I love about Eleventy is that my entire website lives snugly in the node-universe. That makes these kinds of scripts easy to write and integrate. No fancy build process here, just 20-ish lines of code and a bunch more free time.