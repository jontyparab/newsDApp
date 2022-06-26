/**
 * General validators for different entities
 * @module validators
 */

/**
 * Validates URL
 * @param {string} s - URL or string
 * @returns {boolean} - Validity of provided string or URL
 */
const urlValidator = (s) => {
  try {
    new URL(s);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates if string or date is in valid ISO format
 * @param {Date|string} d - Date in string or date type
 * @returns {boolean} - Validity of provided date
 */
const isoDateValidator = (d) => {
  try {
    new Date(d);
    return true;
  } catch (e) {
    return false;
  }
};

export { urlValidator, isoDateValidator };
