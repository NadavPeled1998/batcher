export const awesomePromise = async (promise: Promise<unknown>) => {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    console.error("err:", err);
    return [null, err];
  }
};
