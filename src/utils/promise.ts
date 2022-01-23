// export const awesomePromise = async (promise: Promise<unknown>) => {
//   try {
//     const data = await promise;
//     return [data, null];
//   } catch (err) {
//     console.error("err:", err);
//     return [null, err];
//   }
// };
export const awesomePromise = <T>(promise: Promise<T>) => {
  return promise
    .then((data: T): [T, null] => [data, null])
    .catch((error): [null, any] => [null, error]);
};
