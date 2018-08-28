const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/User')
const ensureLogin = require('connect-ensure-login')
router.use(ensureLogin.ensureLoggedIn('/auth/sign-in'))

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up')
})

router.post('/sign-up', (req, res, next) => {
    const { email, password, role } = req.body

    const encrypted = bcrypt.hashSync(password, 10)

    new User({ email, password: encrypted, role })
        .save()
        .then(result => {
            res.send('User account was created')
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.render('sign-up', { error: 'user exists already' })
            }
            console.error(err)
            res.send('something went wrong')
        })
})

router.get('/sign-in', (req, res, next) => {
    res.render('sign-in', { error: req.flash('error') })
})

router.post(
    '/sign-in',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sign-in',
        failureFlash: true,
    })
)

router.get('/sign-out', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/private', checkRoles('Boss'), (req, res) => {
    User.find({})
    .then(users => {
      res.render('private',{users});
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
        res.redirect('/')
      }
    }
  }
  

module.exports = router