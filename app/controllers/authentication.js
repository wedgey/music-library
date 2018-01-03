const jwt = require('jsonwebtoken');

const config = require("../config/main");

const User = require("../models/user");

function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 24 * 60 * 60 // Set expiry to one day
    });
}

function setUserInfo(request) {
    return {
        _id: request._id,
        username: request.username,
        email: request.email,
        role: request.role
    };
}

//==============================================
// Login Route
//==============================================
exports.login = function(req, res, next) {
    let userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: `Bearer ${generateToken(userInfo)}`,
        user: userInfo
    });
}

//==============================================
// Refresh Token Route
//==============================================
exports.refreshToken = function(req, res, next) {
    let token = req.get('Authorization');
    jwt.verify(token.split(" ")[1], config.secret, { ignoreExpiration: true }, async function(err, decoded) {
        if (err) next(err);
        if (decoded.exp <= Date.now()) {
            try {
                let user = await User.findById(decoded._id).exec();
                let userInfo = setUserInfo(user);
                return res.status(200).json({ token: `Bearer ${generateToken(userInfo)}`, user: userInfo });
            } catch (err) {
                return next(err);
            }
        }
    });
}

//==============================================
// Register Route
//==============================================
exports.register = function(req, res, next) {
    // Check for registration errors
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password.trim();

    // Return error if no email provided
    if (!email) {
        return res.status(422).send({ error: "You must enter an email address." });
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: "You must enter a password." });
    }

    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err); }
    
        // If user is not unique, return error
        if (existingUser) {
          return res.status(422).send({ error: 'That email address is already in use.' });
        }
    
        // If email is unique and password was provided, create account
        let user = new User({
          username: email,
          email: email,
          password: password
        });

        user.save(function(err, user) {
          if (err) { 
              console.log(err);
              return next(err); }

          // Respond with JWT if user was created
          let userInfo = setUserInfo(user);
    
          res.status(201).json({
            token: 'JWT ' + generateToken(userInfo),
            user: userInfo
          });
        });
      });
}