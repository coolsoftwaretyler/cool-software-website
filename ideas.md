Use the new Expo router: - https://blog.expo.dev/rfc-file-system-based-routing-in-react-native-7a35474722a - Maybe a YouTube video? - Go through their major items and set up things I liked/didn't like.

Where should I put javascript functions in my React Native components/screens? - if you can, move it to separate helper functions/files - think about your code as though it was an npm package - what would be the best API for you? - Write your functions like a package

Where should we put team documentation?
Discovery is hard.

React Native focus
Accessibility?
Focus in general?
Look into Android/iOS and how they handle focus

JSX - how much expression is too much? - if/else returns - ternary expressions - IIFEs to return state - Using functions to return state inside a component? - https://stackoverflow.com/questions/44046037/if-else-statement-inside-jsx-reactjs

Storing data in React Native - https://stackoverflow.com/questions/44376002/what-are-my-options-for-storing-data-when-using-react-native-ios-and-android - This is broad - what question do I really want to answer? - Scope down to "different persistence options" vs "strategies for client/server"

Environment variables in React Native? - What's the best way to manage this? .env? something else?

Hiding the keyboard in react native: - https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native

Omnitools and Flashlist - Flashlist is awesome, but it comes with some drawbacks - Omnitools give you some flexibility for the flashlist items to manipulate - Benefits that omnitool can be pulled around the app - Consistent UI patterns

JSX uses expressions, not statements

Enjoy what you're doing - Gumrunner - do better when you're focused onp laying the game

Do the yak shaving - Lots of times dev teams complaints are because they don't do enough Yak shaving

React Native withCredentials - ios doesn't work, android does - https://reactnative.dev/docs/network#known-issues-with-fetch-and-cookie-based-authentication

Let's say you write your own JavaScript modules and publish them to npm/yarn for use in your React Native application. Pure JS , but sort of "targeting" React Native.
Do you:
Bundle and minify your package
Just bundle, but not minify your package
Do something else
Bonus: what patterns, tools, build step do you use for this kind of work?

Thinking about managing network requests and state - MST drives the data - React components just check data

M1 issue?

diff --git a/ios/walterpicksmobileapp.xcodeproj/project.pbxproj b/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
index 1cbbcd36..a966fdb7 100644
--- a/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
+++ b/ios/walterpicksmobileapp.xcodeproj/project.pbxproj
@@ -587,7 +587,7 @@
COPY_PHASE_STRIP = NO;
ENABLE_STRICT_OBJC_MSGSEND = YES;
ENABLE_TESTABILITY = YES;

-     		"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = i386;

*     		"EXCLUDED_ARCHS[sdk=iphonesimulator*]" = "arm64 i386";
      		GCC_C_LANGUAGE_STANDARD = gnu99;
      		GCC_DYNAMIC_NO_PIC = NO;
      		GCC_NO_COMMON_BLOCKS = YES;

Things I like about RN - No third party marketing tools from GTM

Gum runner - Enjoy your work - Explore the furthest possibility, but do it quickly - Stay alive

Testing MST is hard with RNTL - Views - what functions?

Show demo of "living" ES6 imports

Testing with Jest allows you to understand "what is it?" - directly importing your thing, manipulate it, test kt
Uniquely awesome in React Native because everything we have is in JS/TS

diff --git a/packages/mobx-state-tree/**tests**/core/jsonpatch.test.ts b/packages/mobx-state-tree/**tests**/core/jsonpatch.test.ts
index 453e5f4a..240e7362 100644
--- a/packages/mobx-state-tree/**tests**/core/jsonpatch.test.ts
+++ b/packages/mobx-state-tree/**tests**/core/jsonpatch.test.ts
@@ -63,7 +63,7 @@ test("it should apply deep patches to arrays", () => {
Node,
{ id: 1, children: [{ id: 2 }] },
(n: Instance<typeof Node>) => {

-            const children = (n.children as unknown) as Instance<typeof Node>[]

*            const children = n.children as unknown as Instance<typeof Node>[]
               children[0].text = "test" // update
               children[0] = cast({ id: 2, text: "world" }) // this reconciles; just an update
               children[0] = cast({ id: 4, text: "coffee" }) // new object
  @@ -112,7 +112,7 @@ test("it should apply deep patches to arrays with object instances", () => {
  Node,
  { id: 1, children: [{ id: 2 }] },
  (n: Instance<typeof Node>) => {

-            const children = (n.children as unknown) as Instance<typeof Node>[]

*            const children = n.children as unknown as Instance<typeof Node>[]
               children[0].text = "test" // update
               children[0] = Node.create({ id: 2, text: "world" }) // this does not reconcile, new instance is provided
               children[0] = Node.create({ id: 4, text: "coffee" }) // new object
  @@ -150,7 +150,7 @@ test("it should apply non flat patches", () => {
  Node,
  { id: 1 },
  (n: Instance<typeof Node>) => {

-            const children = (n.children as unknown) as Instance<typeof Node>[]

*            const children = n.children as unknown as Instance<typeof Node>[]
               children.push(
                   cast({
                       id: 2,
  @@ -188,7 +188,7 @@ test("it should apply non flat patches with object instances", () => {
  Node,
  { id: 1 },
  (n: Instance<typeof Node>) => {

-            const children = (n.children as unknown) as Instance<typeof Node>[]

*            const children = n.children as unknown as Instance<typeof Node>[]
               children.push(
                   Node.create({
                       id: 2,
  @@ -480,3 +480,48 @@ test("relativePath with a different base than the root works correctly", () => {
  expect(resolvePath(store.map, "/../map/2/model")).toBe(target)
  }
  })
* +test("it should emit one patch for array clear", () => {
* testPatches(
*        Node,
*        { id: 1, children: [{ id: 2 }, { id: 3 }] },
*        (n: Instance<typeof Node>) => {
*            n.children.clear()
*        },
*        [
*            {
*                op: "replace",
*                path: "/children",
*                value: []
*            }
*        ]
* )
  +})
* +test("it should emit one patch for array replace", () => {
* testPatches(
*        Node,
*        { id: 1, children: [{ id: 2 }, { id: 3 }] },
*        (n: Instance<typeof Node>) => {
*            n.children.replace([{ id: 4 }, { id: 5 }])
*        },
*        [
*            {
*                op: "replace",
*                path: "/children",
*                value: [
*                    {
*                        id: 4,
*                        text: "Hi",
*                        children: []
*                    },
*                    {
*                        id: 5,
*                        text: "Hi",
*                        children: []
*                    }
*                ]
*            }
*        ]
* )
  +})
  diff --git a/packages/mobx-state-tree/src/core/node/object-node.ts b/packages/mobx-state-tree/src/core/node/object-node.ts
  index 9624e136..be6aed1e 100644
  --- a/packages/mobx-state-tree/src/core/node/object-node.ts
  +++ b/packages/mobx-state-tree/src/core/node/object-node.ts
  @@ -591,9 +591,10 @@ export class ObjectNode<C, S, T> extends BaseNode<C, S, T> {
       emitPatch(basePatch: IReversibleJsonPatch, source: AnyNode): void {
           if (this._internalEventsHasSubscribers(InternalEvents.Patch)) {

-            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, {
-                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
-            })

*            // calculate the relative path of the patch
*            const path =
*                source.path.substr(this.path.length) + (basePatch.path ? "/" + basePatch.path : "")
*            const localizedPatch: IReversibleJsonPatch = extend({}, basePatch, { path })
               const [patch, reversePatch] = splitPatch(localizedPatch)
               this._internalEventsEmit(InternalEvents.Patch, patch, reversePatch)
           }
  diff --git a/packages/mobx-state-tree/src/types/complex-types/array.ts b/packages/mobx-state-tree/src/types/complex-types/array.ts
  index de3115e5..8a771f18 100644
  --- a/packages/mobx-state-tree/src/types/complex-types/array.ts
  +++ b/packages/mobx-state-tree/src/types/complex-types/array.ts
  @@ -2,7 +2,6 @@ import {
  \_getAdministration,
  action,
  IArrayDidChange,

- IArraySplice,
  IArrayWillChange,
  IArrayWillSplice,
  intercept,
  @@ -43,7 +42,6 @@ import {
  IValidationContext,
  IValidationResult,
  mobxShallow,
- normalizeIdentifier,
  ObjectNode,
  typeCheckFailure,
  typecheckInternal,
  @@ -225,7 +223,7 @@ export class ArrayType<IT extends IAnyType> extends ComplexType<
  return processed
  }

- didChange(change: IArrayDidChange<AnyNode> | IArraySplice<AnyNode>): void {

* didChange(change: IArrayDidChange<AnyNode>): void {
  const node = getStateTreeNode(change.object as IAnyStateTreeNode)
  switch (change.type) {
  case "update":
  @@ -239,6 +237,19 @@ export class ArrayType<IT extends IAnyType> extends ComplexType<
  node
  )
  case "splice":
*                // Perf: emit one patch for clear and replace ops.
*                if (change.removedCount && change.addedCount === change.object.length) {
*                    return void node.emitPatch(
*                        {
*                            op: "replace",
*                            path: "",
*                            value: node.snapshot,
*                            oldValue: change.removed.map((node) => node.snapshot)
*                        },
*                        node
*                    )
*                }
*                  for (let i = change.removedCount - 1; i >= 0; i--)
                       node.emitPatch(
                           {
  @@ -253,7 +264,7 @@ export class ArrayType<IT extends IAnyType> extends ComplexType<
  {
  op: "add",
  path: "" + (change.index + i),

-                            value: node.getChildNode("" + (change.index + i)).snapshot,

*                            value: change.added[i].snapshot,
                             oldValue: undefined
                         },
                         node
