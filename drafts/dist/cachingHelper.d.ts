/**
 * As mentioned in the README, we have a caching proxy that we can use for
 * integration tests to avoid ratelimiting and noisy, flaky tests.
 *
 * This helper will proxy any given URL string, if the .env file tells us to do so.
 *
 * @param url
 * @returns {string}
 */
export declare const proxiedURL: (url: string) => string;
