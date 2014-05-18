'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Item = traceur.require(__dirname + '/../models/item.js');

exports.login = (req, res)=>{
  User.login(req.body.username, user => {
    res.render('users/dashboard', {user: user}, (err, dashboard)=>{
      res.render('users/items', {user: user}, (err, inventory)=>{
        res.send({dashboard: dashboard, inventory: inventory});
      });
    });
  });
};

exports.dashboard = (req, res)=>{
  User.dashboard(req.params.userId, user => {
    res.render('users/dashboard', {user: user});
  });
};

exports.purchase = (req, res)=>{
  User.findByUserId(req.params.userId, user=>{
    var item = new Item(req.params.item);
    user.purchase(item);
    user.save(()=>{
      res.render('users/dashboard', {user: user}, (err, dashboard)=>{
        res.render('users/items', {user: user}, (err, inventory)=>{
          res.send({dashboard: dashboard, inventory: inventory});
        });
      });
    });
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
