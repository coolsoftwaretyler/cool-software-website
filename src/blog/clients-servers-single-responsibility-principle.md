---
layout: post
title: Clients, Servers, and the Single Responsibility Principle
tags: ['post']
description: A practical example of the SRP in a client/server architecture.
date: 2020-08-15
---

I'm working on a poker application and just found a nice refactor that taught me a little bit about the [single responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) in practice. 

## Modelling the desired behavior 

Say you're playing a game of poker. The flop has just been dealt and it's your action. In this position, you can fold, check, or bet. Let's focus on betting. 

If you've got 300 chips and bet 100, the action moves to the next player and they have to fold, call 100, or raise. If everyone calls your bet of 100, the turn will be dealt, and your action comes around again. Now you can fold, check, or bet (up to 200). 

But if you had originally bet 300 chips after the flop, everyone called, and it became your turn again, you would be skipped over. A player who is all in has no action to take - they just wait until the hand wraps up and the showdown happens. 

Since an `all_in` player has a restricted set of actions, we want to set up some indicators to represent when players go all in. 

## The `bet` function 

Consider a `bet` method that looks something like this: 

```rb
def bet(amount) 
  @player.chips.decrement!(amount)
  @game.pot.increment!(amount)
  move_to_next_player
end
```

This is a simple version of what a bet function might need to accomplish. If a players has 300 chips and calls `bet(100)`, everything works out great. 

But what if they call `bet(300)`? We have to mark them `all_in`. 

So maybe we do something like: 

```rb
def bet(amount) 
  @player.update(all_in: true) if amount == @player.chips 
  @player.chips.decrement!(amount)
  @game.pot.increment!(amount)
  move_to_next_player
end
```

That might work if going all in only happened on bets. But it can also happen when calling or raising. There are also a few other pieces of data we want to track, like which betting round a player went all in on, and how much they went all in with. So we can abstract it out to something like: 

```rb
def go_all_in
  @game.pot.increment!(@player.chips)
  @player.update(all_in: true, all_in_round: 1, all_in_amount: @player.chips, chips: 0)
  move_to_next_player
end
```

So now our `bet` function could look like: 

```rb
def bet(amount) 
  if amount == @player.chips 
    go_all_in
  else
    @player.chips.decrement!(amount)
    move_to_next_player
  end
end
```

## The front end code 

The game client is built with React. The betting button looks something like this:

```jsx
<div>
  <input onChange={(e) => updateBetValue(e.target.value)} />
  <button onClick={() => handleClick()}>Bet {betValue}</button>
</div>
```

It's an input that changes the value of the bet, and a button that fires off a betting action to the server through the `handleClick` function. 

## When handleClick does too much 

Here's where I went wrong. Initially, I duplicated my server-side logic that checked for an all in bet in the front end as well. It looked like this: 

```js
const handleClick = () => {
  if (betValue === player.chips) {
    goAllIn(); // Fires off a websocket action to run the `go_all_in` ruby function 
  } else { 
    bet(betValue); // Fires off a websocket action to run the `bet` ruby function. 
  } 
}
```

It works, and when I first made this choice, I decided it was a *good* idea to have duplication of the chip check. I figured it couldn't hurt to have additional checks around it. But I ran into two problems that the single responsibility principle would have warned me of: 

### One change, two files 

Checking for chip equality isn't enough. It's possible that a user might try to be *more* chips than they have, not just the actual number. To catch this, I had to update the `amount == @player.chips` check to `amount >= @player.chips`. 

I forgot to update the JS equivalent, and unit tests began to fail. 

### Confusing signals 

When a player clicks the `BetButton`, they're indicating to the server "I would like to make a bet, here is the amount I'd like to bet". 

Even if their desired bet amount is invalid, it's important to see what users are trying to do, because it keeps fidelity of information when I'm debugging. 

With logic checks in the front end, if the user attempts to submit an invalid bet amount to the server, their message to the server gets intercepted and changed to a `goAllIn()` call. I lose the full set of information and it makes tracking bugs harder. 

## A pretty quick fix

The fix on this one was pretty quick. I refactored `handleClick()` to something like: 

```js
const handleClick = () => {
  bet(betValue);
}
```

It cleaned up my `BetButton` component and helped me track user activity with ease. I also know now that when I get bugs related to invalid bets, I can get the full information about what React was sending to the server, and if I need to adjust my logic around when a `bet` turns into a `go_all_in` call, I know that it lives in the ruby `bet` function and nowhere else. 

It was a fun lesson in clean code for me. A simple change made my code easier to reason about, debug, and maintain. 