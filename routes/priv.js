const express = require('express');
const router  = express.Router();
const ensureLogin = require('connect-ensure-login')
router.use(ensureLogin.ensureLoggedIn('/auth/sign-in'))
// const User = require('../models/user')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', checkRoles('Boss'), (req, res) => {
  User.find({})
  .then(users => {
    res.render('private', {user: req.user},{users});
      // res.render('book-list', { books })
  })
  .catch(console.error)
})


router.get('/private/user/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
      .then(result => {
          res.redirect('private')
      })
      .catch(console.error)
})


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = router;

