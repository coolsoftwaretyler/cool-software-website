---
layout: post
title: A Use Case for CSS Parent Selectors
tags: ['post']
description: At some point, Chris Coyier suggested people write blog posts presenting why they might need parent selectors. Here's mine.
date: 2020-04-10
---

I ran into a use case for CSS Parent Selectors the other day. I've got some form that looks like this: 

```html
<form>
    <fieldset>
        <label for="category_1">Category 1</label>
        <input type="checkbox" id="category_1" name="category_1"><span></span><br><br>
    </fieldset>
    <fieldset>
        <label for="category_2">Category 2</label>
        <input type="checkbox" id="category_2" name="category_2"><span></span><br><br>
    </fieldset>
    <fieldset>
        <label for="category_3">Category 3</label>
        <input type="checkbox" id="category_3" name="category_3"><span></span><br><br>
    </fieldset>
    <input type="submit" value="Show results">
</form>    
```

It allows people to select some grouping of filters: category 1, category 2, and category 3. When they hit `Show results`, they get some results back based on these filters. 

I want to give a visual cue for which filters they've used. Maybe something like a background color on each associated `fieldset` that contains checked checkboxes. That feels somewhat straightforward. 

But right now if I want to style the `fieldset` based on its child, I have to use JavaScript to maybe listen for a `change` or `click` event, find the correct `fieldset`, and update its styles through JS. 

Alternatively, I could set up a pseudo-element to do the job. But wait! `input` elements *can't have pseudo-elements*. So now I have to add an empty `span` as a sibling and style its pseudo-elements. The markup changes to this: 

```html
<form>
    <fieldset>
        <label for="category_1">Category 1</label>
        <input type="checkbox" id="category_1" name="category_1"><span></span><br><br>
    </fieldset>
    <fieldset>
        <label for="category_2">Category 2</label>
        <input type="checkbox" id="category_2" name="category_2"><span></span><br><br>
    </fieldset>
    <fieldset>
        <label for="category_3">Category 3</label>
        <input type="checkbox" id="category_3" name="category_3"><span></span><br><br>
    </fieldset>
    <input type="submit" value="Show results">
</form>    
```

And then I write these styles:

```css
fieldset {
    position: relative;
}

input:checked + span:before {
  content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: green;
}
```

It's workable. It's only a little extra code. But it would be really slick if I could write some CSS that looked like: 

```css
input:checked PARENT_SELECTOR_SYMBOL_HERE fieldset {
    background-color: green
}
```

Here's a [codepen](https://codepen.io/ogdenstudios/pen/jObEqpZ) with the sample code so you can play around with it and see what I mean