---
layout: post
title: "Easy Lambda Development with the Serverless Framework"
tags: ['post']
description: "I've built a handful of lambda functions before, but it's always been a pain. Then I found the Serverless Framework, and my life has changed for the better."
date: 2019-12-13
---

## Lambda pain points 

I've written a handful of [AWS Lambda Functions](https://aws.amazon.com/lambda/). I think they're super neat! I even wrote a blog post about [making a Twitter bot with AWS Lambda](https://ogdenstudios.xyz/2019/05/21/how-to-build-a-twitter-bot-with-aws-lambda.html). 

But if you read through my post, you'll see there are two big pain points: 

* Packaging up the script to upload to Lambda
* Configuring CLoudwatch to run the script 

When I built that Twitter bot, I was entirely new to Lambda and didn't really understand the ecosystem and tooling for it. So it was a huge hassle to make changes to my function, version control them, package them up, upload them to AWS, and then reconfigure the script as needed. 

After a few months of playing around with Lambda and encountering these pain points, I knew I was missing something. Everyone is so excited about Lambda. Netlify and ZEIT are using lambda functions and making them easy for their users to write. How could people be this excited about such an annoying process? 

## The Serverless Framework 

Turns out I was one internet search away from the solution. [The Serverless Framework makes developing Lambda easy](https://serverless.com/). I think I missed this because so many people use the term "serverless" as a generic talking point, and this framework is named so generically. People have probably said to me something like: 

> Hey Tyler! You should really be checking out Serverless! 

And they meant the *framework*, but I thought they were just telling me to write Lambda (which I was already doing). 

And boy howdy have I been missing this. It's made my life so much easier. I'm late to the party, but I'm about to party hard.

## Use the Serverless Framework to build a Twitter bot 

I won't go into detail about all the code here, but I thought it would be great to revisit my Twitter bot using the Serverless framework this time. 

## Install serverless

In order to use all the cool tools Serverless provides, you have to [install it](https://serverless.com/framework/docs/getting-started/). Run: 

``` 
npm install -g serverless
```

Then you'll need to [configure your AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/#create-an-iam-user-and-access-key). Follow those instructions to create a new IAM user and configure your serverless installation with: 

```
serverless config credentials --provider aws --key 1234 --secret 5678
```

## Copy code over

I'm pretty much going to copy over the bot logic from my [lambda twitter bot](https://ogdenstudios.xyz/2019/05/21/how-to-build-a-twitter-bot-with-aws-lambda.html) blog post. It's been a few months and I've evolved, so I'd probably refactor this or write it differently. But for now, I know the lambda works, and I just want to convert that project over to the Serverless framework. 

## Set configuration

In the root of my project, I'm going to create a new file called `serverless.yml`. 

### Set up the service, provider, and runtime 

In this file, I tell Serverless that the name of the service is `openerr`. I instruct Serverless to run it through AWS with the Node 10 runtime. The YAML block for that looks lie: 

```
service: openerr

provider:
  name: aws
  runtime: nodejs10.x
```

### Set up the environment variables 

Next, I provide it with environment variables. To do so, I create a file in the project called `config.js`. I make sure to add this to my `.gitignore` file so I don't check it into version control. 

In this file, I export an object like this: 

```
module.exports.secrets = () => {
    return {
        "openStatesKey": "VALUE_GOES_HERE",
        "twitterToken": "VALUE_GOES_HERE",
        "api_key": "VALUE_GOES_HERE",
        "api_secret_key": "VALUE_GOES_HERE",
        "access_token": "VALUE_GOES_HERE",
        "access_token_secret": "VALUE_GOES_HERE"
    }
}
```

And I fill it in with the correct values. In `serverless.yml`, I add these to the environment  under the provider key like so: 

```
provider:
  name: aws
  runtime: nodejs10.x
  environment:
    openStatesKey: ${file(./config.js):secrets.openStatesKey}
    twitterToken: ${file(./config.js):secrets.twitterToken}
    api_key: ${file(./config.js):secrets.api_key}
    api_secret_key: ${file(./config.js):secrets.api_secret_key}
    access_token: ${file(./config.js):secrets.access_token}
    access_token_secret: ${file(./config.js):secrets.access_token_secret}
```

In the lambda function itself, I can access these with the following values: 

```
process.env.openStatesKey
process.env.twitterToken
process.env.api_key
process.env.api_secret_key
process.env.access_token
process.env.access_token_secret
```

### Configure the function 

Then I configure the function's name, handler, memory size, timeout, and schedule of execution. 

I tell it to look for the handler in `index.js`, allocate 512 mb of space, and set a timeout of 15 minutes (specified in seconds). 

I use the [AWS cron expression](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) to schedule it to run every day at 10 a.m. UTC. 

This block looks like: 

```
functions:
  startScraper:
    handler: index.handler
    memorySize: 512
    timeout: 900
    events:
      - schedule: cron(0 10 * * ? *)
```

### The full serverless configuration

My full `serverless.yml` file looks like this: 

```
service: openerr

provider:
  name: aws
  runtime: nodejs10.x
  environment:
    openStatesKey: ${file(./config.js):secrets.openStatesKey}
    twitterToken: ${file(./config.js):secrets.twitterToken}
    api_key: ${file(./config.js):secrets.api_key}
    api_secret_key: ${file(./config.js):secrets.api_secret_key}
    access_token: ${file(./config.js):secrets.access_token}
    access_token_secret: ${file(./config.js):secrets.access_token_secret}

functions:
  runOpenerr:
    handler: index.handler
    memorySize: 512
    timeout: 900
    events:
      - schedule: cron(0 10 * * ? *)
```

## Test it local

One of the most useful features of the Serverless framework is the ability to run functions *locally*. No more changing, zipping, uploading, configuring, and clicking "Test". Now I can invoke my function on my local environment like so: 

```
serverless invoke local --function runOpenerr
```

It's awesome. I can debug, make tweaks, and execute my lambda right from terminal. What a quality of life improvement. 

## Deploy it up

After running the function locally and passing all my tests with `npm test`, I'm ready to deploy. All I need to do is run: 

```
serverless deploy
```

Once it's finished, I can log in to my AWS console and check my lambdas to see it's there, listed as `openerr-dev-runOpenerr`. Everything is configured and ready to go. I can test it out in the console and make sure it runs. Everything is in tip-top shape, and my lambda development life has been made that much easier. 

## Remaining pain points

With a simple, isolated lambda like mine, this process is pretty smooth with few pain points. However, I've used the Serverless Framework for some more complex lambdas that need to invoke other lambdas, and I find two major pain points there:

1. **Permissioning:** The AWS permissioning system is arcane, and the documentation is terrible. Giving a lambda permission to run other lambdas is... harrowing. Not to mention the plethora of other services. To be honest, I haven't found any great resources for this. Mostly I guess-and-check, and that's time consuming. Some day I hope AWS improves their documentation. Or maybe I'll move to another platform with better support. I suppose when you're the top, monopolistic dog, you don't have to be nice to your end users. 
2. **Debugging chained functions:** Similarly, when you set up lambdas to chain together, following their data, reading their outputs, and isolating bugs is a real challenge. I suppose the answer is using something like [State Machines](https://docs.aws.amazon.com/step-functions/latest/dg/tutorial-creating-lambda-state-machine.html), which I'm excited to try out! 