// A simple time formatting utility

/**
 * Formats a timestamp into a HH:MM string.
 * @param timestamp The date object or a value that can be passed to the Date constructor.
 * @returns A string in HH:MM format, e.g., "14:30".
 */
export const formatTime = (timestamp: Date | number | string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
