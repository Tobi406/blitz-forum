
// taken from https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/

const asyncSome = async <T>(
  array: T[],
  predicate: (element: T) => Promise<boolean>
) => {
  for (let element of array) {
    if (await predicate(element)) return true;
  }
  return false;
}


export default asyncSome;