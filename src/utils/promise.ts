export const awesomePromise = <T>(promise: Promise<T>) => {
  return promise
    .then((data: T): [T, null] => [data, null])
    .catch((error): [null, any] => [null, error]);
};
