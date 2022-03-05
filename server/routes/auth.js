const axios = require('axios').default;
const { Router } = require('express');
const passport = require('passport');
const { User, Favorite, User_Image } = require('../db/index');

const authRouter = Router();
let accessToken;

authRouter.get(
  '/spotify/login',
  passport.authenticate('spotify', {
    scope: ['streaming', 'user-read-email', 'user-read-private'],
  })
);

authRouter.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    accessToken = req.user;
    // res.cookie('spotify', accessToken);
    res.redirect('/');
  }
);
// console.log(accessToken, 20);
authRouter.get('/token', (req, res) => {
  res.json({
    accessToken: accessToken,
  });
});

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] }),
  (res, req) => {
    console.log('/google successful');
  }
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/logout',
  }),
  (req, res) => {
    console.log(req.session.passport.user.id, '/google/callback called');
    res.cookie('googleId', req.session.passport.user.id);
    res.redirect('/');
  }
);

authRouter.get('/user', (req, res) => {
  // console.log(req.cookies, 'auth 20');
  //should search all models and send back a user object

  
  if (req.cookies.googleId) {
    User.findAll({
      where: {
        id: req.cookies.googleId,
      },
    })
      .then((user) => {
        res.status(200);
        res.send(user);
      })
  
     .catch((err) => console.error('auth 28', err));
  } else {
    res.sendStatus(404);
  }
});

authRouter.post('/account', (req, res) => {

  //const { id } = req.params;
  const user = req.body;
  let userDetails = {};
  //console.log(user, 12);

  User.findOrCreate({
    where: {
      id: user.id,
    },
  })
  .then((data) => {
      userDetails.userName = user.name;
      userDetails.id = data[0].id;
       Favorite.findAll({
          where: {
            userId: user.id
          },
        })
        .then((favs) => {
          
          
          if(favs){
            userDetails.favorites = favs;
            //console.log(favs, 50000000);
          } else {
            userDetails.favorites = [];
          }
          //IMAGES
          User_Image.findAll({
            where: {
              userId: user.id
            },
          }) .then((images) => {
          if(images){
            userDetails.pics = images;
          } else{
            userDetails.pics = [];
          }
          //console.log(userDetails);
          res.status(200);
          res.send(userDetails);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(404);
        })
        })
       
    })      
        .catch((err) => {
          console.error('auth user lookup error:', err);
          res.sendStatus(500);
        })
      })

authRouter.get('/logout', (req, res) => {
  console.log('yep');
  res.clearCookie('googleId');
  res.clearCookie('connect.sid');
  res.status(200);
  res.redirect('/');
});

module.exports = { authRouter, accessToken };
