const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database');

//register route
router.post('/register', (req, res, next)=>{
    //creating new user
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password //plain text password
    });

    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success:false, msg:'Filed registration'});
        }else{
            res.json({success:true, msg:'Registration successful'});
        };
    });
});

//authenticate route
router.post('/authenticate', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg:'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //a week
                });
                res.json({
                    success:true,
                    token: 'JWT'+token,
                    //pass user as new object to avoid giving away the password
                    user:{
                        id:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email
                    }
                })
            }else{
                res.json({success:false, msg:'Wrong password'})
            }
        });
    });
});

//profile route ...will be protected bt tokens
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    res.json({user: req.user});
});



module.exports = router;