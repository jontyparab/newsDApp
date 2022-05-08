import { formatDistanceToNow, parseISO, format, parse } from 'date-fns';

// const formatNewsDate = (date) => {
//   return formatDistanceToNow(parseISO(date));
// };

const formatNewsDate = (date) => {
  try {
    return format(parseISO(date), 'LLLL d, yyyy');
  } catch (error) {
    return date;
  }
};

export { formatNewsDate };
