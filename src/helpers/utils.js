export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') {
    return true;
  }

  return Object.getOwnPropertyNames(obj).length <= 0;
};

/**
 * Creates a function the recieves key and value and transforms the value depending on the object map.
 * The object can have a '__default' key that acts as the default case in switch.
 *
 * @param {Object} mapperObj a map object from key to value
 * @param {Function} [defaultTransform=identity] the default transform to use incase the key is missing in mapperObj and there is no __default key
 * @example
 * const mapperObj = {
 *   key1: (value) => value.join(','),
 *   __default: (value) => value.toString()
 * }
 *
 * const mapper = createMapper(mapperObj);
 * const transformedValue = mapper('key1', ['value1', 'value2'])
 */
export const createMapper = (mapperObj, defaultTransform = (value, key) => ({ [key]: value })) => (key, value) => {
  const transform = mapperObj[key] || mapperObj.__default;
  if (transform) {
    return transform(value, key);
  }

  return defaultTransform(value, key);
};

/**
 * A generator for interspersing a delimiter between items of an iterable.
 * @param iterable
 * @param delim
 */
export function* intersperse(iterable, delim) {
  let first = true;
  for (const item of iterable) {
    if (!first) yield delim;
    first = false;
    yield item;
  }
}

/**
 * Reconstruct a node's path up a tree
 * @param {Object} node Tree node whose path we want
 * @param {Function} getById a function to return a node in the tree by it's id
 * @returns {[Object]} Array of the given node ancestor, from root to node including.
 */
export const tracePath = (node, getById) => {
  let x      = node;
  const path = [node];
  while (x && x.parent_id) {
    x = getById(x.parent_id);
    if (x) {
      path.unshift(x);
    }
  }
  return path;
};
