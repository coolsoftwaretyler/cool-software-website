const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addCollection("post", function (collection) {
    let pages = collection.getFilteredByTag("post");
    return pages.sort(function (a, b) {
      return b.date - a.date;
    });
  });

  eleventyConfig.addLiquidFilter("date", function (date) {
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: "src",
    },
  };
};
