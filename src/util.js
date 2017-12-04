module.exports.forEach = function forEach(collection, iteratee) {
  if(typeof iteratee !== 'function') {
    throw Error('iteratee must be a function')
  }
  if(!Array.isArray(collection)) {
    throw Error('collection must be an array')
  }
  for(let i = 0, len = collection.length; i < len; i++) {
    iteratee(collection[i], i)
  }
}

module.exports.reduce = function reduce(collection, iteratee, initialAccumulator) {
  if(typeof iteratee !== 'function') {
    throw Error('iteratee must be a function')
  }
  if(!Array.isArray(collection)) {
    throw Error('collection must be an array')
  }
  let internalAccumulator = initialAccumulator;
  for(let i = 0, len = collection.length; i < len; i++) {
    internalAccumulator = iteratee(internalAccumulator, collection[i], i)
  }

  return internalAccumulator;
}
