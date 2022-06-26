import { formatDistanceToNow, parseISO, format, parse } from 'date-fns';

/**
 * General formatters
 * @module formatters
 */

// const formatNewsDate = (date) => {
//   return formatDistanceToNow(parseISO(date));
// };

/**
 * Formats date for news articles
 * @param {string} date - Date in ISO format as string
 * @returns {string} - Date string in LLLL d, yyyy format
 */
const formatNewsDate = (date) => {
  try {
    return format(parseISO(date), 'LLLL d, yyyy');
  } catch (error) {
    return date;
  }
};

export { formatNewsDate };
