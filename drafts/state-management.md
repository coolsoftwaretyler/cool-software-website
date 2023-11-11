Imagine you have a deeply nested state tree. Leaf models in the tree are passed as props to React components using observer. Changes in one of these leaves may require updates to distant parts of the tree. What should you do?

**Option 1: Make the root available everywhere**

If the root is globally available, we can just call an action on the root or drill down to where we need to call an action.

- Pros: Very simple to implement, explicit behavior
- Cons: Testing the leaves (model or component) requires construction of an entire tree, leaves may need to know about very unrelated parts of the tree (less modular), root may need a very large number of actions ("god class")

**Option 2: Use getParent to walk up the tree**

In many ways, this is not materially different from option 1. Leaves still need to know about the broader context in which they are used which causes loss of modularity / testability.

**Option 3: Use volatile state to store event handler functions**

Something like this:

```
interface Volatile {
    handleValueChange?: (previous: number, current: number) => void,
}
export const Model = types.model("Model", {
    value: 42,
}).volatile(
    () => ({} as Volatile)
).actions(self => ({
    changeValue(next: number) {
        const previous = self.value;
        self.value = next;
        if (self.handleValueChange) {
            self.handleValueChange(previous, self.value);
        }
    }
}));
```

Now parents that contain a `Model` as a child can register an event handler by setting the value of the volatile `handleValueChange`.

- Pros: Explicit "hook" for when parent has a chance to apply changes elsewhere, does not require the child to know what other changes need made, does not require global root, easy to test
- Cons: In order to make these events "bubble", they will have to be handled and reraised at every level of tree (basically the same event bubbling / prop drilling problem that you get in React), some events may need a pre (with opportunity to cancel) and post (react to change) which is extra clutter

**Option 4: Use MobX reactivity (such as autorun or reaction)**

Like this:

```
Parent.actions(self => ({
    afterCreate(): void {
        reaction(() => self.child, child => {
            self.handleChildChange(child);
        });
    },
}));
```

- Pros: No need to configure anything on the child to allow for reacting to changes
- Cons: Have to dispose of reaction when appropriate, don't get an exact "description" of what changed (for example, if you're watching for changes to an array, your reaction will fire but you won't know if an item was added, removed, internally modified, etc.)

**Option 5: Use onAction**

This works similarly to reaction, but with some trade-offs:

- Pros (compared to reaction): You get a path to what change was made
- Cons (compared to reaction): You have to manually intepret / walk that path to get to the change since the path is just a string

**And so we come to option 6... Middleware!**

Middleware seems to be able to handle all of this pretty elegantly (or overcomplicatedly depending on your perspective I guess).

```
import { addMiddleware, Instance, types } from "mobx-state-tree";

export const Child = types.model("Child", {
    value: 0,
}).actions(self => ({
    setValue(value: number) {
        self.value = value;
    }
}));
export type ChildInstance = Instance<typeof Child>;

export const Parent = types.model("Parent", {
    children: types.array(Child),
}).actions(self => ({
    setChildValue(index: number, value: number) {
        self.children[index].value = value;
    },
})).actions(self => ({
    afterCreate() {
        // If any of the children find the answer to life, the universe, and
        // everything, pass that knowledge along to all children
        addMiddleware(self, (call, next, _abort) => {
            if (Child.is(call.context) && call.name === "setValue") {
                // We can lean on TypeScript in many ways to make this safer...
                const [ value ] = call.args as Parameters<ChildInstance["setValue"]>;
                if (value === 42) {
                    for (let i = 0; i < self.children.length; i++) {
                        self.setChildValue(i, 42);
                    }
                }
            }
            next(call);
        });
    }
}));
```

- Pros: No need to configure child in any way, parent gets direct access to all information on the action, easy to test, automatically bubbles, allows aborting actions
- Cons: More code, needs some TypeScript fanciness to be fully type safe (but it can be made fully type safe which is great), you have to make extra actions on the parent (because the middleware handler isn't an action, it can't directly mutate any state, and if you tried to just `child.setValue` in the handler, you would cause infinite recursion), may be confusing to understanding how it works

---

I'm happy to provide additional information / code / sandboxes if needed, but I tried to keep this as concise as possible. I'm hoping to have a discussion and see what other people think about these various choices, maybe find some consensus on the best way to handle this kind of updating disparate parts of a deep tree. I couldn't find anything in the docs or other discussions that dealt with this problem in this way, so I'm not sure if this is crazy and abusing middleware or actually a good idea.

I'm immensely grateful for anyone who has read all this and offers a reply. 🙇
