const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');


router.get('/users/signin', (req, res) =>   {
    res.render('users/signin')
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) =>   {
    res.render('users/signup')
});

router.post('/users/signup', async (req, res) =>   {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 4) {
        errors.push({text: 'Debes insertar un nombre de más de 4 caracteres'});
    }
    if(email.length <= 0) {
        errors.push({text: 'Debes insertar un correo electronico'});
    }
    if(password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password})
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'Usuario ya registrado');
            res.render('users/signup', { errors: [{ text: 'Usuario ya registrado' }], name, email, password, confirm_password });
        } else {
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Usuario registrado');
        res.redirect('/users/signin');
    }};
    
});

router.get('/users/logout', (req, res) => {
    if (req.user) {
        req.logout((err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            res.redirect('/');
        });
    } else {
        
        res.redirect('/');
    }
});


module.exports = router;