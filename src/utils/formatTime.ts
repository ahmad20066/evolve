import moment from 'moment';

export const formatDate = (timestamp?: string): string => {
  if (!timestamp) {
    return 'Invalid date'; // Handle undefined or invalid input
  }
  const date = new Date(timestamp);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', {month: 'short'}); // 'Feb'
  return `${day} ${month}`;
};

export const calculateTimeDifference = (endTime: string): string => {
  const now = new Date(); // Current date
  const endDate = new Date(endTime);

  if (isNaN(endDate.getTime())) {
    return 'Invalid date';
  }

  const timeDiff = endDate.getTime() - now.getTime(); // Difference in milliseconds

  if (timeDiff <= 0) {
    return 'Time has already passed';
  }

  // Calculate days
  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Calculate months
  const nowMonth = now.getMonth() + now.getFullYear() * 12;
  const endMonth = endDate.getMonth() + endDate.getFullYear() * 12;
  const months = endMonth - nowMonth;

  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} remaining`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }
};

export const calculateTime = (time: string): string => {
  const dateKey = moment(time).format('MMMM D, YYYY'); // Format: "October 12, 2024"
  return dateKey;
};
