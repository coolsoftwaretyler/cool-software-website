## Slide about websites being documents

## Ok, but what if we want to do more? Maybe serve up dynamic content?

## That's great, but it doesn't work for every use case

Like a calculator? Or one that conditionally renders content?

Use Gitlab screenshot

## Enter DOM manipulation

So we certainly can use the browser to do this kind of thing.

Show the calculator.html

## Ok, so that works for this specific use case. But what about the general case?

https://www.toptal.com/javascript/emulating-react-jsx-in-vanilla-javascript

Show DOM.js

We can build our own tools to sort of manipulate the DOM. We can make it flexible. But all of a sudden we're a few steps removed from the actual implementation of what we're working on. We're maintaining internal libraries.

## Wouldn't it be better if we could express something like HTML but supercharged?

```js
<div className="repository">
  <div>{item.name}</div>
  <p>{item.description}</p>
  <img src={item.owner.avatar_url} />
</div>
```

## But that's not really what the browser sees

It's JSX! Which React can transform into something like this:

```js
React.createElement(
  "div",
  { className: "repository" },
  React.createElement("div", null, item.name),
  React.createElement("p", null, item.description),
  React.createElement("img", { src: item.owner.avatar_url })
);
```

## But what about more complex interactions? Isn't that slow?

React DOM

https://reactjs.org/docs/faq-internals.html

## There's two players here: React and ReactDOM

https://stackoverflow.com/a/34114665
