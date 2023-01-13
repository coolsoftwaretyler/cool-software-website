/**
 * As mentioned in the README, we have a caching proxy that we can use for
 * integration tests to avoid ratelimiting and noisy, flaky tests.
 *
 * This helper will proxy any given URL string, if the .env file tells us to do so.
 *
 * @param url
 * @returns {string}
 */
export const proxiedURL = (url) => {
    // Check if the caching proxy is enabled in the .env file.
    const cachingProxyEnabled = process.env.CACHING_PROXY;
    // The caching proxy should be running at localhost:9090
    const cachingProxyPrefix = 'http://localhost:9090/';
    // Replace https:// or http:// with http/
    const cachingProxySuffix = url.replace(/^https?:\/\//, 'http/');
    const urlRoutedThroughProxy = cachingProxyPrefix + cachingProxySuffix;
    // If the caching proxy is enabled, use the proxy. Otherwise, use the url.
    return cachingProxyEnabled ? urlRoutedThroughProxy : url;
};
