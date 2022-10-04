---
layout: post
title:  "Lessons from An Event Apart Denver"
tags: [An Event Apart, conference, 'post']
description: "A roundup of what I learned at An Event Apart Denver."
date: 2019-11-23
---

It's been a little longer than I intended, but I attended [An Event Apart Denver](https://aneventapart.com/event/denver-2019) this year and had a blast. Thanks to my company for sponsoring me to go! 

Here are some bullet points and thoughts it sparked for me. Overall, seeing these presentations and spending time with other web developers and designers inspired met o learn more, push myself harder, and be a better developer. I want to make my projects look better, run faster, and contribute responsibly to the internet overall. 

## Dynamic type

[Jason Pamental gave a talk about dynamic type](https://aneventapart.com/event/denver-2019#s17249). Some cool things I picked up here: 

* Using [variable fonts](https://v-fonts.com/) can be faster and trigger fewer network requests. Since one font file has all the typographic variation you need, there are fewer additional files to load in for variation. 
* There are some fonts out there that are being progressively shipped *as variable fonts* when loaded in from certain web font endpoints. I think that's really cool and a great way to provide progressive enhancement to customers. 
* Firefox has a [fonts tab in web inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Edit_fonts) that provides a ton of useful tools for working with variable fonts. 

## Third party software 

[Trent Walton gave a talk about third party software and the web](https://aneventapart.com/event/denver-2019#s17395).

* He showed us a really useful tool to [map your web requests](http://requestmap.webperf.tools/). 
* Tag managers are a huge culprit in ever-increasing requests and bundle size. This is something I've absolutely encountered in my day-to-day. It's nice to hear it brought up at a conference.
* If your website breaks without ad functionality, keep in mind the stats out there that say 20-40% of users are running ad blockers. What breaks for them? How can we deliver content that won't get blocked. 

## Generation style

[Eric Meyer's talk about generated content was one of my favorites](https://aneventapart.com/event/denver-2019#s16758). I use pseudo-elements every single day at work. They're one of my favorite CSS features. Even though I use them heavily, I learned a bunch during this talk:

* Pseudo-elements are treated as DOM children for flex/grid layout, but not always ::first-of-type and other CSS selectors.
* Generated content is useful because you have one surface on which you can do things: content, styling, asset management
* But generated content can be difficult to work with because *it's not always clear where content is coming from*. 
* Also turns out [the double colon is the correct syntax](https://www.w3schools.com/CSS/css_pseudo_elements.asp), which was news to me. Fortunately, browsers respect the single colon for backwards compatibility.

## Redefining the techncial possibilites of CSS 

[Rachel Andrew talked about redefining the possilities of CSS](https://aneventapart.com/event/denver-2019#s16765). And boy did it really blow me away. Her demos were really something else and made me think about: 

* Using scroll-snapping, view units, and grid to create screen experiences that behave like an app.
* Using multi-col layout that smartly regenerated itself like physical media might. 
* We can look to print media CSS standards for concepts like "I've got pages with fixed dimensions, so please just give me as many of those as I need". 
* What are the possibilities for revisiting [css regions](https://webplatform.github.io/docs/tutorials/css-regions/)? This spec failed before, but perhaps there is something new and better on the horizon now that we have grid we can use with it. 

## Intrinsic layouts

[Jen Simmons gave a talk about intrinsic layouts](https://aneventapart.com/event/denver-2019#s16751). I've listened to her on podcasts before and read many of her articles. But seeing her in person was truly inspiring. Here's what I picked up about intrinsic layout:


* Intrinsic layout is going to be the next hotness. The step *past* responsive web design. It's time to start learning and using it. 
* I hadn't really seen or used `min-content` or `max-content` before but they seem like really useful tools for better sizing in CSS.
 layouts are the next hotness, past responsive web design
* Overall, web devs need to use more grid. We can design a reasonable single column experience as a fallback that is enhanced progressively by grid. It's time to adopt and use it. 
* In a similar vein, we can do more with flexbox. Grid doesn't need to replace it, but can in fact empower flexbox to be more expressive.
* We can use grid placement algorithms to program layout in really cool and innovative ways. 
* I need to watch [Layout Land](https://www.layout.land/) and [Mozilla Developer](https://www.youtube.com/MozillaDeveloper). 

I started doing some of the [exercises, examples, and studies from Jen](https://labs.jensimmons.com/) on my own. You can see me trying to emulate and learn from her over at my own [layout practice site](https://ogden-studios-layout-practice.netlify.com). Built with [Eleventy](https://www.11ty.io/).

## Mobile planet 

[Luke Wroblewski gave a talk about the state of mobile devices](https://aneventapart.com/event/denver-2019#s16753)

* As a *rough* estimate, almost 90% of the world population 14 years old and up have mobile devices. That's a absolutely unfathomable. We can pretty much reach every single person in the world via smart phone. 
* Compare that to something like 23% of the population that owns desktop computers. 
* We have a responsibility to give people access to content over their phones. 
* People spend most of their mobile time in native apps, and very little in browses. This has driven a lot of investment in mobile apps
* **But!** People are downloading tons of apps and never using them. Almost 25% of apps are abaonded after first use.  
people spending 3hrs a day on the pone, most of their time in native mobile apps, very little in browsers. 
* The mobile web is great for *unique* visitors. Websites have better audients than new mobile apps. Sharing links is easier through the web. 
* Even though people spend most of their time in mobile *apps*, they usually spend it in one or two apps. The other apps get almost no time. But mobile *web* serves a discovery purpose that apps can't really compete with. 
* Web is good at reach, native apps are good at rich. 
* Things people hate about browsing the web on mobile: slow web pages and interstitials

There's a ton of opportunity in mobile web. Native apps don't have to supercede all of it, but we need to do better. 

## Animation on the bleeding edge 

[Sarah Drasner gave a talk about bleeding-edge animation technique](https://aneventapart.com/event/denver-2019#s16731).

* The goal of the web is first and foremost about communicating. 
* The future of the web is animation. We can improve existing sites with page transitions.
* [Nuxt](https://nuxtjs.org/) provides a great page transition API. I use Nuxt at work and should absolutely use these things more. 
* We should aim for native-like page transitions on the web. One of the biggest criticisms of the web is it doesn't feel as fluid as mobile. 
* When we remap page layout through hard page refreshes, we incur a cognitive load
* If we can visually group 
* Turning to responsive web design: what if it wasn't just 2D responsive, but also 3D responsive?
* Sarah showed us different levels: works in VR, knows it's in VR and is then interactive there
* A VR media query would be useful for this kind of work. 
* We live in a 3D and in-motion world, so static 2D is actually an abstraction and requires brain power to process. 
* The web platform is lagging behind in making things complement reality. We need to break out of the rectangles of the past. 

## Making motion inclusive 

[Val Head gave a talk about inclusive animation](https://aneventapart.com/event/denver-2019#s16733)

* There used to be a time where we knew what the "average" web user was. We knew their screen resolution, their connection speed, and their office set up. 
* But now, we can't group users so quickly and easily. 
* Inclusive design is not building one thing for all people, but a diversity of ways to participate so everyone has a sense of belonging. 
* Animation can help with visual continuity, reducing cognitive load, guiding tasks, and connecting ideas. 
* We don't often talk about [WCAG](https://www.w3.org/TR/WCAG21/) in animation, but there are a lot of guidelines for animations built in. 
* 3 big guidelines for animation:
    1. 2.2.2 (pause, stop, hide)
        - Think carousels, videos, and animated background videos/animations.
        - They all need pause, stop, hide options.
    2. 2.3.1 (three flashes or below threshold)
        - This one comes from comes from broadcast research 
        - Nothing can flash more than 3 times in any second unless its flashing is below the red flash threshold 
        - You can gate this kind of content if you must. It's better to warn people than not. But entirely hiding your content isn't really appropriate or inclusive. 
    3. 2.3.3 (animation from interactions)
        - Motion triggered by interactions should be disable-able unless it's essential 
        - We ought to avoid unnecessary animation 
        - We ought to take advantage of the reduce motion feature in the user-agent styles in operating systems and respect user's wishes. 
* `prefer-reduced-motion` is usable today, but it's kind of the opposite of progressive enhancement
* "Reduce" doesn't have to be "remove" in terms of adjusting animation.

Overall, it was a great talk and I ended up signing up for the [UI Animation Newsletter](https://uianimationnewsletter.com/).