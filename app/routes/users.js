'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.login = (req, res)=>{
  User.login(req.body.username, user => {
    res.render('users/dashboard', {user: user});
  });
};

exports.dashboard = (req, res)=>{
  User.dashboard(req.params.userId, user => {
    res.render('users/dashboard', {user: user});
  });
};

exports.cashout = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    var woodToCash = req.body.cashout * 1;
    if (user.wood > woodToCash){
      user.wood -= woodToCash;
      user.cash += woodToCash / 5;
      user.save(()=>{
        res.send({user:user});
      });
    }
  });
};
