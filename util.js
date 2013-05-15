exports.randInt = function (num) {
  return Math.ceil(Math.random() * num) + 1;
};

/* Returns the cartesian product of the two arrays. */
exports.product = function (arr1, arr2) {
  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    var x = [].concat.apply([], arr1.map(function (el1) {
      return arr2.map(function (el2) {
	return [el1, el2];
      });
    }));
    return x;
  }
  return null;
};
