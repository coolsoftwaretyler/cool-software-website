---
layout: post
title: Introduction to Version Control with Git
tags: ['post']
description: A high level primer and overview of version control and Git - for beginners just getting started.
date: 2020-11-27
canonical_url: 'https://coolsoftware.dev/introduction-to-version-control-with-git/'
highlight: Git
---

Software development is a collaborative exercise at its core. When you plan and write software, you'll have to collaborate with at least one or two of the following: 

1. Clients, stakeholders, or other non-software professionals
2. Managers, coworkers, or other people on your software team
3. Yourself - either your past self or your future self 

When you collaborate on actual code, you'll want to know things like: 

1. What's the current state of the code? 
2. How has the code changed over time? 
3. Who changed the code over time? 
4. How can I safely make changes to the existing codebase without worrying about breaking it or undoing previous work?

Effective collaboration is an entire field unto itself. But these are some of the major themes that come up in day-to-day software work. And fortunately, there are powerful tools to toslve them with widespread adoption, which means if you learn how to use those tools, you'll be able to speak the same language as many of your future coworkers and collaborators. 

## Version control with Git

The [Git SCM book](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) defines version control as "a system that records changes to a file or set of files over time so that you can recall specific versions later". It's akin to things like [Google Docs version history](https://support.google.com/a/users/answer/9308971?hl=en) or [Microsoft Word Track Changes](https://support.microsoft.com/en-us/home/backgroundauth?provider=AAD&amp;end=False). 

There are a variety of version control systems out there, including [Git](https://git-scm.com/), [Subversion](https://subversion.apache.org/), [Vault](http://www.sourcegear.com/vault/), and more. At the time of writing, Git has found the highest rate of adoption and integration in the software industry. If you're learning a new version control system, Git is likely to be the most relevant in your career. 

Let's look at what Git does with a practical example. 

Say you've got a Python program that prints out the [Fibonacci sequence](https://www.math.temple.edu/~reich/Fib/fibo.html). You could write it with [recursion](https://www.geeksforgeeks.org/recursion/) like this: 

```py
# Python program to display the Fibonacci sequence

def fibonacci(n):
   if n <= 1:
       return n
   else:
       return(fibonacci(n-1) + fibonacci(n-2))

nterms = 10

# check if the number of terms is valid
if nterms <= 0:
   print("Please enter a positive integer")
else:
   print("Fibonacci sequence:")
   for i in range(nterms):
       print(fibonacci(i))
```

Coding the Fibonacci sequence is a classic Computer Science challenge to demonstrate principles of recursion, and usually the next step in CS courses is to demonstrate how to write it *without* recursion. 

So if you were in an intro computer science class, and it took you a week to come up with a Fibonacci program like the one above, and you wanted to try a different approach without losing your week's worth of work, how might you do that?

### Without version control

A straightforward solution would be to have to files: `recursive_fibonacci.py` and `alternative_fibonacci.py`. That works for simple cases where you control what files your computer runs. But what if you had a server that wanted to know the specific file name, and you had to change the file name each time you made a code change? That would be a hassle. 

And the hassle would scale out as you did more and more. If your coding assignments required 2, 3, 10, 50, or any other number of files, and you needed to make changes to each one, all of a sudden you'd be duplicating dozens or hundreds of files. 

### With version control

Version control makes this complicated problem simple. You can write all your code in one file, or one directory, and use version control software to safely make modifications without losing prior work. 

Git takes "snapshots" of your code when you ask it to. So you could take a snapshot of the recursive Fibonacci sequence in a file called `fibonacci.py` and then make a change. Perhaps you change it to something like this: 

```py
def fibonacci(n):
    a,b = 0,1
    for i in range(n):
        a,b = b, a+b
    return a
    
print fibonacci(10)
```

It's a substantial change! But fear not, because Git knows what the first version looked like in a snapshot, and it knows how to get from the current version back to the snapshot version. 

### A quick demonstration

That was a pretty abstract rundown of what version control is, and what Git does to accomplish version control. Let's look at it in context in a [screen recording](https://www.youtube.com/watch?v=tZKZVBEAiN0): 

<iframe width="560" height="315" src="https://www.youtube.com/embed/tZKZVBEAiN0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here's a walkthrough of the video:

1. I open a file called `fibonacci.py`
2. I write out the recursive version of the algorithm.
3. I initialize a Git repository with the command `git init`
4. I add the current directory to the staging area in git with `git add .`
5. I commit my changes to the git repository and add a message: `git commit -m 'init commit - recursive'`
6. I create and check out a new branch called `fibonacci-without-recursion`, with the command `git checkout -b fibonacci-without-recursion`
7. I change the algorithm so it no longer uses recursion, and I check the status of the git repository with `git status`, which shows my changed files.
8. I add those changes to the staging area with `git add .`
9. I commit those changes to the branch with a message: `git commit -m 'change fibonacci to not use recursion'`
10. I check what possible git branches I have with `git branch`, and I see `master` and `fibonacci-without-recursion`. 
11. I check out the `master` branch with `git checkout master`, and the file changes back to the master version. 
12. I repeat steps 10 and 11, but switch back to `fibonacci-without-recursion` instead.
13. I switch back to the `master` branch one final time
14. I merge the changes from `fibonacci-without-recursion` into the master branch by running `git merge fibonacci-without-recursion`
15. I check the log of git activity with `git log`
16. I reset the git repository to the initial commit, using `git reset 57f1142ba3aa0f1dd71872599f32b5633a929f44 --hard` (the long string of numbers/letters here is the hash of the snapshot, which I retrieved from the git log)

Those are the basic commands you might use to manage a git repository. Even as a person who uses Git every day, that covers maybe 80% of my day-to-day needs. 

There's much more to explore, and this is a high level overview. Codecademy has a more hands on course that might be useful to learn the nitty-gritty details and get practice under your fingertips: [https://www.codecademy.com/learn/learn-git](https://www.codecademy.com/learn/learn-git). 