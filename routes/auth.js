const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../models/User')

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
        failureRedirect: '/auth/sign-in',
        failureFlash: true,
    })
)
router.get('/sign-out', (req, res) => {
    req.logout()
    res.redirect('/auth/sign-in')
})


module.exports = router;
