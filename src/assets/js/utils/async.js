// @ts-check
/**
 * Asynchronous utilities
 * @module async
 */

/**
 * Creates asynchronous delay for specified milliseconds.
 * @param {number} ms Delay time in milliseconds.
 * @returns {Promise<void>} A promise which resolves after delay.
 */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export { delay };
