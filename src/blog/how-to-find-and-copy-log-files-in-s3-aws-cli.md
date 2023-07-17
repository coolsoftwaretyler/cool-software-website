--
layout: post
title: How to Find and Copy Log Files from S3 with AWS CLI
tags: [post]
description: A couple quick tips on using AWS CLI to locate and download log files with embedded datetime information in their filepath.
date: 2022-10-09
highlight: Cloud Computing

---

_This blog post assumes you have already set up [AWS CLI](https://aws.amazon.com/cli/) on your machine._

Let's say you're using some logging service that runs in your application and uploads log files to S3 for long term storage.

Most log providers like that will upload logs to an S3 path that looks something like:

`s3://bucket-you-connected-to-log-provider/your_production_app/2022-08/2022-08-22T19:38:02Z-2022-08-22T20:38:02Z.json.zst`

We use [Logtail](https://betterstack.com/logtail) for this, and I really like the way they upload those objects, because it makes wayfinding easy. The idea is that you have:

1. A bucket that denotes your connection to logtail
1. A prefix that tells you which app the object is tied to
1. A prefix for the specific month an object was tracked in
1. A range of datetimes in the object name that tells you what timestamps you can find in the object file itself

This kind of naming convention might differ across logging providers, but most of them will give you _something_ similar.

Now let's say you want to dig into the logs for your application, and you know that you're looking for some events on 2022-08-23 between the hour of 1pm and 2pm in UTC.

Searching for the relevant files can be done with AWS CLI with a quick command:

```sh
aws s3 ls s3://bucket-you-connected-to-log-provider/your_production_app/2022-08/ | grep 2022-08-03T13
```

And you should see output that looks something like this:

```sh
2022-08-25 13:33:24         13 2022-08-23T12:38:02Z-2022-08-23T13:38:02Z.json.zst
2022-08-25 13:38:24         13 2022-08-23T13:38:02Z-2022-08-23T14:38:02Z.json.zst
```

`grep` will also nicely highlight any instances of `2022-08-03T13` in that output to give you a good sense of what it found.

Then you can grab one of those object names, say the first one: `2022-08-23T12:38:02Z-2022-08-23T13:38:02Z.json.zst`, and download it to a path of your choosing like so:

```sh
aws s3 cp s3://bucket-you-connected-to-log-provider/your_production_app/2022-08/2022-08-23T12:38:02Z-2022-08-23T13:38:02Z.json.zst .
```

This will copy the `2022-08-23T12:38:02Z-2022-08-23T13:38:02Z.json.zst` object locally to your current working directory with a file that matches. You can modify that `.` to point to any path in your command line.
