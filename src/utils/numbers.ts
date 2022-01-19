// create a function that limits a number by a maximum and minimum value

export const limit = (number: number, min: number, max: number): number => {
  return Math.min(Math.max(number, min), max);
};
