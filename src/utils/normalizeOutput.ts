//@ts-nocheck
// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
function removeEmpty<T>(obj: T): T {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object'){
        removeEmpty(obj[key]);
      }
      else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  };

export default function normalizeOutput<T>(object: T): T{
      return removeEmpty(object);
}