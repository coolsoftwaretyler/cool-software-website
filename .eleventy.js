module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addCollection("post", function (collection) {
    let pages = collection.getFilteredByTag("post");
    return pages.sort(function (a, b) {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
    },
  };
};
