
const asyncMap = async <T, I = any>(
  array: T[],
  func: (element: T) => Promise<I>,
) => {
  return await Promise.all(array.map(func));
};

export default asyncMap;
