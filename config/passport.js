const localStrategy = require('passport-local')
.Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport){
    // Done is a callback 
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        // Match User
        User.findOne({email: email})
        .then(user => {
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            // Match password: user.password is encrypted because it is coming from db 
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    //Null coresponds with the first argument from callback so we want null error as first arg 
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Password incorrect'});
                }
            })
        })
    }))

    // Serialise user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}