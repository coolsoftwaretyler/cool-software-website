https://react.dev/learn/scaling-up-with-reducer-and-context
https://codesandbox.io/p/sandbox/scale-up-reducer-and-context-react-dev-n6d6j2
https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2Findex.tsx%3A8%2C12

advantages:
data modeling happens on its own, no need to worry abou trect particulars
automatic type utilities
UI is basically just declarative JSX
no need to do any kind of prop drilling
can handle form state through actions, rather than chaining togehter disparate controls

cons:
wrapping on observer is a pain, and we probbly won't be doin ga hook: https://github.com/mobxjs/mobx/discussions/2566

If you're working with React and building more complex apps today than you were yesterday, you might be

The two code snippets you've provided illustrate different approaches to state management in a React application. The first snippet uses React's Context API with `useReducer` for managing state, while the second snippet uses MobX-State-Tree (MST) for state management. Let's compare and contrast these two approaches.

### React Context with useReducer

1. **State Management**: This approach uses the Context API to pass down state and dispatch functions through the component tree without having to pass props down manually at every level. The `useReducer` hook is used to manage the state in a more predictable way by specifying how actions transform the state.

2. **Immutability**: The state is updated immutably, using pure functions in the reducer to return new state objects based on actions.

3. **Boilerplate**: You need to write more boilerplate code to set up the context providers, hook functions, and the reducer.

4. **Testing**: The reducer function can be easily tested in isolation since it's a pure function.

5. **Performance**: React's Context can sometimes lead to unnecessary re-renders if not used carefully, but splitting the context into state and dispatch (as done in this example) can help mitigate this issue.

6. **Integration**: This approach is built into React, so there's no need for additional libraries beyond what React provides.

### MobX-State-Tree

1. **State Management**: MST uses observable state trees, which means that components can react to changes in the state automatically. Actions are used to modify the state, and MST takes care of making the updates observable.

2. **Mutability**: MST allows you to write code as if you were mutating the state directly, but under the hood, it applies changes immutably and emits snapshots of the state.

3. **Boilerplate**: MST reduces the boilerplate by providing a more concise way to define models, actions, and views. It also includes many utilities for common patterns.

4. **Testing**: MST stores can also be tested, and since actions are defined as part of the model, they can be tested in the context of the store.

5. **Performance**: MST optimizes performance by tracking which components observe which parts of the state and only re-rendering those components when the observed parts of the state change.

6. **Integration**: MST is a separate library that needs to be added to a React project. It has its own set of concepts and APIs that developers need to learn.

### Conclusion

- If you prefer a more functional approach and want to use only what React provides, the Context API with `useReducer` might be more suitable.
- If you're looking for a more object-oriented approach with less boilerplate and powerful state management features like snapshots, patches, and middleware, MST could be the better option.

Both approaches have their strengths and are capable of handling complex state management needs in a React application. The choice between them often comes down to personal preference, the specific requirements of the project, and the familiarity of the development team with the libraries and patterns involved.
