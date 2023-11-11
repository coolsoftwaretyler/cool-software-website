> Changes in one of these leaves may require updates to distant parts of the tree. What should you do?

To start, I think this is a yellow flag that we can model our data better. A handful of these scenarios is usually unavoidable, but if you have so many of these scenarios, I think there's an underlying modeling problem.

However, I understand many of us work on existing codebases where we can't make changes to the fundamental data model of our state management layer. So it's a good exercise to answer the rest of your question. I just wanted to address the root issue which is: can we avoid having leaf nodes interact with other parts of the tree? That would be a holistic answer to this.

But if it's impossible or undesirable to change the tree structure, here's some thoughts about your proposed solution:

### Make the root available everywhere

This is basically how I do it in my day-to-day work. I think it's maximally flexible, and if a component wants multiple leaves, even if those leaves don't interact with one another, I can pull them from the root directly.

I've experienced the cons you mentioned - testing can be hard. But if you take some time to write a good tree factory, that can improve your test suite overall anyways. I think solving the testing problems in this approach will improve your testing strategy.

However, one con you cna't avoid is the "god class" scenario. Again, if you need more than a handful of those god-level actions, I think an abstraction has been missed. But at the end of the day, it makes a lot of conceptual senes for me for the "root" to be able to kind of reach down wherever it wants and do stuff. Sure, "god classes" are undesirable. But if there's going to be one anyways, why not make it the root of the state tree?

### Use getParent

One advantage you didn't discuss here was that `getParent` is easier to mock or stub out in tests. You can side-step reconstructing a whole tree in testing, and return narrower trees.

I think `getParent` can be clunky (it's still so strange to me that it throws an error when there is none, but other users have told me they like this). Another sharp edge is if you're using the [depth argument](https://mobx-state-tree.js.org/API/#getparent) and your tree structure changes. It can be annoying to hunt it down.

When I have taken this approach, I often wrap the `getParent` call in a helper view on the leaf node. But hey, sometimes child nodes need to know stuff about parent nodes. That's valid, IMO.

### Volatile state

I've never even considered this, but I kind of like it! I really like the way this decouples leaf nodes from parent actions. It does seem like it could get tricky to figure out correct bubbling and order-of-operations.

I bet someone who was very good at event-driven programming would have some interesting thoughts around this. I am no expert on that, myself, but I think this approach warrants more consideration and writing. I'm going to personally do some thinking around it. Not sure what I want to do about it, other than lend credence to the thought. Very cool!

### MobX Reactivity

This makes sense, but every time MST users have to "drop down" into MobX land, I consider that a failing of MST. In our docs, we say that you don't need to know anything about MobX to use MST, and I hope to be able to live up to that.

Still, I think this is perfectly valid. I just hope that we can provide better answers than this. I would not recommend this, except for folks who are already MobX users and feel very comfortable with it.

### onAction

This is definitely a good use for that hook, but as you say, it requires a good amount of understanding of how MST paths work to be useful. And it suffers from similar issues as `getParent`, where if your paths change, you have a bunch of dependent code that needs to change as well.

I think I prefer this over the MobX approach, but in a similar way, it's a good way to start understanding what's going on in your tree. If it weren't for Middleware (next section), I'd find this quite compelling as well.

### Middleware

Middleware is _awesome_. I think that's preceisely what middleware was designed for. I like to reach for middlewares when I end up in a state where none of the above make sense. It's pretty easy to test, or avoid testing. But you're right, the typings can be kind of weird, and if you have enough of these scenarios that you have a bunch of middlewares, the routing ends up getting kind of gnarly, and you can try to smooth it over with a function, but at some point, you really just need a big if statement or switch statement to figure out which middlewares do what.

I also think there's a sharp edge on middlewares: since they're always running, if you introduce some non-performant code at the entrypoint, you might slow down your whole app.

### My recommendation

Again, my actual recommendation is: try to model your data such that you rarely need to think about it. But if you need any of these solutions, they're all pretty great!

But if I was forced to make my recommendation in order of highest preference to lowest preference:

1. **Root node everywhere**: the root of your tree is basically the god class anyway, so use it as such and make it available everywhere. This makes everything straightforward to write, and the downsides are mostly test related. Be careful of tight coupling, but that's always good advice anyway.
2. **Middlewares:** If you don't want a god class, consider middlewares (but hey... isn't that just like a demigod?). IMO, they're a great way to bridge any inconsistencies or troubles in your data modeling. If MST doesn't fit your use case perfectly, middlewares are a good escape hatch to course correct.
3. **getParent**: `getParent` would be item #2 if I didn't hate the error handling so much. I just don't like having to `try...catch` because I wanted to get my node's parent. But that's neither here nor there. It's a personal preference. Other than that, `getParent` is part of the API, and I encourage folks to use it when it makes sense.
4. **Volatile**: `onAction` should actually probably win here since I think it's more intended for this use case than `volatile`, but... I think this is _so cool_.
5. **onAction**: I think the other approaches will give you similar results for less work. But `onAction` is also part of the API for a reason. Could be very helpful.
6. **MobX Reactivity**: we owe a great deal to MobX. I think this is a perfectly valid approach. But MST is a library intended to abstract away the details of MobX, so I don't want to recommend people re-introduce MobX concepts to their MST codebase where there are viable alternatives directly from the MST API. Still, this is perfectly reasonable.
