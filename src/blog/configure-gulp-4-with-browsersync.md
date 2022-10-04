---
layout: post
title: 'Configuring Gulp 4 with Browsersync'
tags: ['gulp', 'gulp 4', 'browsersync', 'javascript', 'post']
description: 'Last week I cleared a personal blocker: getting Browsersync to work with Gulp 4, despite confusing documentation.'
date: 2019-07-10
---

Last week my team began prototyping a small web app. The scope of the project was small enough to rule out a full Rails site or JavaScript framework, but we still wanted to have some tooling available such as [Sass](https://sass-lang.com/) and [Browsersync](https://www.browsersync.io/).  

Our preferred way to bring these tools together is by using [Gulp](https://gulpjs.com/). But we always run into a gotcha when configuring Browsersync with Gulp - the Browsersync docs aren't updated for Gulp 4. 

The [Browsersync Gulp docs](https://www.browsersync.io/docs/gulp) suggest the following configuration: 

```
// gulpfile.js
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
```

But this syntax no longer works in Gulp 4. Instead, you'll have to use the new gulp `series()` with [async completion](https://gulpjs.com/docs/en/getting-started/async-completion), like so:

```
// gulpfile.js
gulp.task('sass', function (done) {
    gulp.src("app/scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("app/css"))
        // Use stream since browsersync only cares about when files are finished compiling
        .pipe(browserSync.stream());
        done();
});

gulp.task('default', gulp.series('sass', function(){

    browserSync.init({
        server: './app'
    });

    gulp.watch("app/scss", gulp.series('sass'));
    gulp.watch('*.html').on('change', browserSync.reload);
}));
```

I adapted this workaround from [Liquid Light's guide to upgrading to Gulp 4](https://www.liquidlight.co.uk/blog/how-do-i-update-to-gulp-4/). 

### Gulp series

When running tasks in a series (such as serving, watching, and compiling Sass files with Browsersync), gulp now uses the [series()](https://gulpjs.com/docs/en/api/series), which has a different callback signature than the Browsersync docs indicate.

### Async completion

[Async completion](https://gulpjs.com/docs/en/getting-started/async-completion) is a way to denote that a serial task has completed. For a simple usecase like this, we can pass a `done` argument to the callback function in the `sass` task, and call it at the end with `done();`. 