'use strict';

// var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var _ = require('lodash');

class Tree{
  constructor(userId) {
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  grow(){
    var heightmax = this.isAdult ? this.height * 0.1 : 2;
    this.height += _.random(0, heightmax, true);

    var healthmax = this.isAdult ? 200 - ((this.height / 12) * 0.1) : 200;
    healthmax = healthmax < 10 ? 10 : healthmax;
    this.isHealthy =  _.random(0, healthmax, true) > 1;
  }

  chop(){
    this.isChopped = true;
    this.isHealthy = false;
    this.height = 0;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }

  get classes(){
    var classes = [];

    if (this.height === 0){
      classes.push('seed');
    } else if (this.height < 24){
      classes.push('sapling');
    } else if (!this.isAdult){
      classes.push('treenager');
    } else {
      classes.push('adult');
    }

    if (!this.isHealthy || this.isChopped){
      classes.push('dead');
    } else {
      classes.push('alive');
    }

    if(this.isChopped){
      classes.push('stump');
    }

    if(this.isBeanStalk){
      classes.push('beanstalk');
    }

    return classes.join(' ');
  }

  get isAdult(){
    return this.height >= 48;
  }

  get isGrowable(){
    return this.isHealthy && !this.isBeanStalk && !this.isChopped;
  }

  get isChoppable(){
    return this.isHealthy && this.isAdult && !this.isBeanStalk;
  }

  get displayHeight(){
    return (this.height / 12).toFixed(2);
  }

  get isBeanStalk(){
    return (this.height / 12) >= 10000;
  }

  static plant(userId, fn){
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, ()=>{
      fn(tree);
    });
  }

  static findAllByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    trees.find({userId:userId}).toArray((e, objs)=>{
      var forest = objs.map(o=>_.create(Tree.prototype, o));
      fn(forest);
    });
  }

  static findByTreeId(treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id:treeId}, (e, tree)=>{
      tree = _.create(Tree.prototype, tree);
      fn(tree);
    });
  }

}

module.exports = Tree;
