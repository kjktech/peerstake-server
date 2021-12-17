export function isDateValid(dt) {
  var reGoodDate =
    /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
  return reGoodDate.test(dt);
}
