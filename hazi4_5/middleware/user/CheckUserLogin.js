module.exports = function (objectrepository) {

  return function (req, res, next) {
    if (typeof req.session.id === 'undefined') {
      return res.redirect('/');
    } else {
      return next();
    }
  };
};