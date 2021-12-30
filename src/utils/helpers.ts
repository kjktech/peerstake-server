export function isDateValid(dt) {
  var reGoodDate =
    /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
  return reGoodDate.test(dt);
}

//  Object.defineProperty(Array.prototype, 'flat', {
//   value: function(depth = 1) {
//     return this.reduce(function (flat, toFlatten) {
//       return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
//     }, []);
//   }
// });
