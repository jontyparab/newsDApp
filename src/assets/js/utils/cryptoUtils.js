/**
 * Utilities for crypto specific tasks.
 * @module cryptoUtils
 */

/**
 * Crypto utility to generate large random uuid of number type
 * @returns {number} - Large random integer
 */
const randomIntUUID = () => {
  //   return BigInt('0x' + crypto.randomUUID().replaceAll('-', ''));
  return Number(
    '0x' + crypto.randomUUID().substring(0, 15).replaceAll('-', '')
  );
};

export { randomIntUUID };
