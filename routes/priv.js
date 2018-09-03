const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login')
router.use(ensureLogin.ensureLoggedIn('/auth/sign-in'))
const User = require('../models/User')
const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', checkRoles('Boss'), (req, res) => {
  User.find({})
    .then(users => {
      res.render('private', { users });
    })
    .catch(console.error)
})


router.get('/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(result => {
      res.redirect('/priv/private')
    })
    .catch(console.error)
})

router.get('/users/add', (req, res, next) => {
  res.render('create-employee')
})

router.post('/users/add', (req, res, next) => {

  const { email, password, role } = req.body

  const encrypted = bcrypt.hashSync(password, 10)

  new User({ email, password: encrypted, role })
      .save()
      .then(result => {
          res.redirect('/priv/private')
      })
      .catch(err => {
          if (err.code === 11000) {
              return res.redirect('auth/sign-up', { error: 'user exists already' })
          }
          console.error(err)
          res.send('something went wrong')
      })
})

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/sign-in')
    }
  }
}

module.exports = router;

