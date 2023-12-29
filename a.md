The error you're encountering with 11ty (Eleventy) is related to Liquid, a templating language that 11ty supports. The error message:

```
unexpected token at ": 20", file:./src/blog/flexible-reusable-text-react-native.md, line:124, col:15 (via ParseError)
```

indicates that there's a syntax issue with a Liquid expression or filter in your Markdown file on line 124, at column 15.

Here's why this might be happening:

1. **Liquid Syntax in Code Blocks**: If you have Liquid syntax inside your code blocks (which you do), and you're not escaping it or telling 11ty to ignore it, 11ty will try to parse it as part of the Liquid template, which can cause errors.

To resolve this issue, you can do one of the following:

- **Escape Liquid Tags**: You can escape Liquid tags by wrapping them with `{% raw %}` and `{% endraw %}` tags in your Markdown file. For example:

  ```liquid
  {% raw %}
  ```tsx
  // Your code block with Liquid-like syntax
  ```
  {% endraw %}
  ```

- **Use Code Fences**: Ensure that your code blocks are properly fenced with triple backticks (```) so that 11ty recognizes them as code blocks and doesn't attempt to parse the contents.

- **Ignore Code Blocks**: You can configure 11ty to ignore certain portions of your Markdown files, such as code blocks, when rendering templates.

Here's how you might update your Markdown file to avoid the error:

```markdown
---
layout: post
title: "Flexible and Reusable Text in React Native"
tags: ["post"]
description: "A technique to keep React Native typography simple and consistent."
date: 2023-12-29
canonical_url: "https://coolsoftware.dev/blog/flexible-reusable-text-react-native/"
highlight: React Native
---

... (rest of your content)

{% raw %}
```tsx
// Your code block that was causing issues
```
{% endraw %}

... (rest of your content)
```

By wrapping the problematic code block with `{% raw %}` and `{% endraw %}`, you're telling 11ty to ignore the Liquid syntax within that block, which should prevent the parsing error.

Please apply one of these solutions to the code blocks in your Markdown file that contain syntax that could be misinterpreted as Liquid tags or filters. After making the changes, try building your 11ty project again.
