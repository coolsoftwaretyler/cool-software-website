---
layout: post
title: 'Using Github Repository Templates with Eleventy'
tags: ['github', 'git', 'templates', 'eleventy', 'post']
description: 'If you use Github repository templates with static site generators like Eleventy, you can optimize your workflow.'
date: 2019-09-03
---

This year, Github released [repository templates](https://github.blog/2019-06-06-generate-new-repositories-with-repository-templates/). I love this feature, particularly for static sites. 

At work, we ship a lot of interactive maps as marketing assets. They usually consist of one page with some copy and a map widget. I like to use [Eleventy](https://www.11ty.io/) for these projects. 

Since most of these sites run on the same stack and have similar folder structure, marrying **Eleventy** with **repository templates** is a real time saver. Here's how I built out a workflow for the team.

## Create the repo 

First, I [created a new repository in Github](https://help.github.com/en/articles/creating-a-new-repository). I named the repository **slippy-map-starter**. I gave it a description: **Template repo for slippy map static sites.**

## Initialize the local project

Then, on my local machine, I created a new directory called `slippy-map-starter`. 

*We use [Yarn](https://yarnpkg.com/lang/en/) at work, but [npm](https://www.npmjs.com/) will also work here. It uses different syntax for the Eleventy commands.*

I initialized the node project with:

```
yarn init
```

I answered the questions to initialize `package.json`. 

I initialized the git repo with:

```
git init
```

With the git repo initialized, I added a `.gitignore` file to the root directory. This file looks like: 

```
node_modules
_site
yarn.lock
```

This file prevents me from checking in the `node_modules` folder, the `_site` folder (Eleventy specific), and the `yarn.lock` file to git. This keeps the repo clean and avoids lockfile errors as the `package.json` and its dependencies change over time. 

## Set up Eleventy

With node and git initialized, I initialized [Eleventy](https://www.11ty.io/). I added it with:

```
yarn add @11ty/eleventy -D
```

With Eleventy installed, I set up the config file, `.eleventy.js`, in the root of the project. It looks like:

```
module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    return {
      dir: {
        input: "src"
      }
    };
  };
```

This configures Eleventy to use `src/` as the input folder, and to use [passthrough file copy](https://www.11ty.io/docs/copy/) for the `src/css` and `src/js` folders. Passthrough file copy will copy the files without trying to process them any further. I use it for static assets so I can author my CSS and JavaScript alongside the Eleventy templates.

In the root of the fold, I also added a `.eleventyignore` file, which looks like:

```
README.md
```

This one-line file prevents Eleventy from processing `README.md` into the output folder.

Finally, I added two scripts to the `package.json` file. The `build` script only runs the Eleventy build. The `dev` script builds with Eleventy and starts a local server with [Browsersync](https://www.browsersync.io/). `package.json` looks like:

```
{
  "name": "slippy-map-starter",
  "version": "0.0.0",
  "description": "Template repo for slippy map static sites.",
  "main": "",
  "scripts": {
    "build": "yarn eleventy",
    "dev": "yarn eleventy --serve"
  },
  "repository": "",
  "author": "Tyler Williams",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "@11ty/eleventy": "^0.9.0"
  }
}
```

## Build the template project

With Eleventy configured to my liking, I populated the actual project. I won't go over the specifics of each of these files. That's outside of the scope of this post. 

After populating my starter files, the project looked like this: 

```
|-- _site
|-- node_modules
|-- src
    |-- _data
        |-- slippyMapConfig.js
    |-- css
        |-- style.css
    |-- js
        |-- main.js
    |-- index.html
|-- .eleventy.js
|-- .eleventyignore
|-- .gitignore
|-- package.json
|-- README.md
|-- yarn.lock
```

## Push the project to the repo 

With my project files in place, the project was ready to push up to the template repo.

I added the files with: 

```
git add .
```

Then I commit with: 

```
git commit -m "init commit"
```

Then I add the repo with: 

```
git remote add origin git@github.digitalglobe.com:creativeservices/slippy-map-starter.git
```

Finally, I push everything up with: 

```
git push -u origin master
```

## Create a repository template 

Back in github, I went to **Settings** and checked the **Template repository** checkbox (right underneath the repository name). 

With that setting enabled, anyone who has permission to view the repo will see a button for **Use this template** , which will allow them to use it as a starter for their own project, copying over its files and content. 

## So what?

This workflow is great for our marketing map widgets. Those projects need the same folder structure, templates, CSS, and JavaScript. The only thing we change is the copy and map functionality. 

With a common Eleventy starter and Github repository templates, our team spends less time on project overhead, and more time implementing high-value, project-specific features. When we decide to make changes to our map API and design library, we can ensure all future sites use the correct updates. 