import { formatDistanceToNow, parseISO, format } from 'date-fns';

// const formatNewsDate = (date) => {
//   return formatDistanceToNow(parseISO(date));
// };

const formatNewsDate = (date) => {
  return format(parseISO(date), 'LLLL d, yyyy');
};

export { formatNewsDate };
