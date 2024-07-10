In the last two months, I built and shipped a mobile game called My Brick Breaker. It's a brick breaking style arcade game that's free to download, and has no ads. I built it with a freemium model, so players can play the game two times every 8 hours, or pay $0.99 one time for lifetime access. You can [find it in the App Store here](https://apps.apple.com/us/app/my-brick-breaker/id6502668210?platform=iphone), or on [Google Play as an open beta](https://play.google.com/store/apps/details?id=com.coolsoftware.bestbrickbreaker).

## Why Make a Game at All?

### Personal reasons

I recently finished my Master's in Software Engineering, and I was looking for something to occupy my (extremely limited) free time outside of work. Specifically, I wanted a project that would roughly fit into Rob Walling's "step 1" category from the [Stair Step Method of Bootstrapping](https://robwalling.com/2015/03/26/the-stair-step-method-of-bootstrapping/). The idea is to sell a one-time purchase product in an existing ecosystem, where success is driven by marketing channels.

Many people choose to write ebooks or make courses for step 1 businesses. And I definitely considered it. But after writing a short draft of a book, and outlining some courses, I just didn't have the energy or interest to get those things to market.

I started thinking about other "digital products" that I could sell. I'm a pretty avid phone gamer. I play a lot of flow games while I listen to podcasts or watch TV with my wife. And due to my primary job at [Walter Picks](https://www.walterpicks.com/), I'm more than a little familiar with the mobile ecosystem. Shipping a simple mobile game became attractive to me. But I had to make sure it met some other criteria.

### Professional Reasons

At Walter Picks, I'm the lead software engineer on a very small, extremely dynamic engineering team. We're a young startup with a ton of traction. Walter Picks is my main focus, and I have no intention of changing that. I wanted a project I could own from top to bottom, but it needed to be something that:

1. Isn't even close to business-critical, so if I have to leave it alone for weeks at a time, no one would be upset.
2. Needs no uptime maintenance, so again I can leave it alone for weeks at a time without issue.
3. It also needed to be "shaped" like my primary work at Walter Picks. We ship a b2c app for fantasy sports managers and sports bettors. So I wanted to make sure the skills I learned on this project would translate to my primary job.

Mobile games made a lot of sense here:

1. No one is going to be "mad" if I let a mobile game sit without an update for a while. So when things get hectic at work, I can very easily step back from my project without guilt or regret.
2. I explicitly chose to make a single player game with no cloud computing requirements. There are no servers, and I didn't even include any analytics. This kept the project simple, but also means there's really nothing for me to continuously work on, other than the game itself.
3. Walter Picks operates many orders of magnitudes higher than my game probably ever will. But at the end of the day, both Walter Picks and my mobile game are mobile funnels. I need to get people to see the store listing, download the app, use the app, and eventually purchase it. So the skills I learned here made a lot of sense together.

## How I Learned Game Dev

I've never so much as opened Unity, but with a decade of experience and a master's degree, I've learned how to learn. Here's how I approached it:

First, I wanted to just do any generic Unity tutorial. I looked around on YouTube and found [this awesome Angry Birds clone by Jason Weimann](https://www.youtube.com/watch?v=HAvfA1F3qTo&t=6629s). I ran through the tutorial in about three hours and had a working, small game. It wasn't the type of game I wanted to build, but the educational material was so good that I was able to use it as a solid foundation for Unity overall.

Once I had a working game, I realized I needed to learn some more specifics about the *type* of game I wanted to create. I lucked out here, because Jason actually has a [YouTube tutorial about building a Ballz clone from scratch](https://www.youtube.com/watch?v=DvrANfzvtyI), which is precisely what I wanted to do.

Jason's Ballz video is a great foundation for a brick breaking game, but it's a quick jaunt through the general idea. There are a lot of details I had to pick up after that. I wish I could give a shout out to all the Unity forum commenters and Stack Overflow contributors that helped, but I didn't keep track of every thread.

A few other video tutorials that helped came from Sasquatch B studios:

1. [I learned how to make damage flash with this tutorial](https://www.youtube.com/watch?v=rq6yGh-piIU)
2. [And I learned how to make particles there as well](https://www.youtube.com/watch?v=0HKSvT2gcuk)

With those resources and ChatGPT, I was able to put together my game in just under 40 hours of work over about 6 weeks.

Honorable mention: Thor's [Develop Games website](https://www.develop.games/) was a huge source of inspiration, and [Thomas Brush](https://www.youtube.com/@thomasbrush) kept me motivated when I was feeling discouraged. I pretty frequently pull up YouTube shorts from Thor and Thomas to inspire myself. I highly recommend them.

## My Experiment Design

Working at a startup, I'm pretty big on making bets, and leveraging both failures and successes to figure out the next steps for myself. So once I had a sense of how much time it was going to take to build my game, I set some success criteria for it. Here's how I thought about it:

### Most successful outcome

Since this was my first ever foray into game development, I didn't need to make my current hourly rate/salary. Instead, I wanted to target an extremely low "entry level" hourly rate. Let's call it $15/hour.

With 40 hours of work on the project, I would consider it a raging success if it made $600 in the first month. I would also consider it a very huge success if it made $600 in the first *three months*.

But even if I don't make that money in the timeframe, the game just needs to make $600 in its entire lifetime to feel like it was financially worth it (at my extremely discounted, starter rate).

### Neutral Outcomes

I'm an optimist, but I understand realism. I honestly don't know if the first game I ever make, in just 40 hours of work, is going to find enough success to bring in $600, even on its lifetime. So I didn't want to get discouraged if I don't hit those goals. I decided to consider my experiment a neutral outcome if I could at least make $100 from it in the first year to pay for the Apple Developer account I renewed in order to publish it.

And of course, if the game could make $100 in a year, it seems plausible that it *might* hit the lifetime earnings I'd like over many years. Remember, I built this game to require no maintenance on my part, so any cash it earns over its lifetime is mostly profit for me and doesn't require additional work to bring it in.


### Bad outcomes

After watching, listening, and reading a ton of content about game dev, I've come to understand there are two primary failure modes for game developers:

1. Never releasing their first game.
2. Never releasing their second game.

If you watch any youtube video on the subject of "why most game devs fail", you'll usually hear a lot about how the last mile of shipping a game is really the hardest. Once you've built the core game loop and play tested a little bit, the "boring stuff" tends to get in the way: setting up distribution accounts on platforms, figuring out your build process, setting up store listings, etc.

I would consider this game a failure if I never launched it, because then I would join the thousands of "aspiring" game devs. And to me, it wasn't good enough to just be an "aspiring" anything. I am a game dev, and I've built a game that real people paid real money to play.

If I couldn't get this game out to even one player, I would have considered it a failure. If I couldn't even get one person to purchase it, I would have considered it a failure.

## Play Testing

Once I had a reasonably-playable demo (pretty much right after watching the Ballz clone video), I got about a dozen play testers through TestFlight and Google. I took their feedback, fixed bugs, and used them as an initial set of supporters. I'm eternally grateful to everyone who played my game in its roughest stage.

## Results

Once I shipped my game to the app stores, I did a few things: 

1. I set up a OneLink so I could easily route people to the store listings, and gather some top-of-funnel information: [https://onelink.to/9xxtuu](https://onelink.to/9xxtuu)
2. I set up a [TikTok account for my LLC](https://www.tiktok.com/@coolsoftwaregames) to promote this game, and any future games I make.
3. I [connected with another TikTok account who is doing some marketing for me, participating in any upside](),
4. I told a bunch of people about my game on LinkedIn and Twitter.

It's been about a month in the stores. So let's talk about how we did:


## What's next

I'd consider my game development experiment a "neutral" outcome. I think there's evidence that I'm good at this, and that I can make this a sustainable side hustle for myself.

### Improving My Brick Breaker



### Making my next game

