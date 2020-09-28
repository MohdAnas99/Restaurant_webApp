
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const cors = require('./cors');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Favorites.find({})
    .populate('user').populate('dishes.dish')
    .then((Favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Favorites);
    }, (err) => next(err))
    .catch((err) => {
         err = new Error('You do not have a favorite list');
         err.status = 404;
         res.setHeader('Content-Type', 'application/json');
         return next(err);
        });
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
   
    if(Favorites.exists({user : req.user._id})){
         Favorites.findOne({user : req.user._id})
                  .then((fav) => {
                   fav.dishes.push(req.body);
                   fav.dishes.filter((value, index)=>fav.dishes.indexOf(value)===index );
                    fav.save()
                  .then((fav) => {
                    Favorites.findById(fav._id)
                    .populate('user')
                    .populate('dishes.dish')
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav); 
    
                    })
                                 
                }, (err) => next(err));
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else{
          Favorites.create({user : req.user._id})
          .then((fav)=>{
            fav.dishes.push(req.body);
            fav.save()
            .then((fav) => {
                Favorites.findById(fav._id)
                .populate('user')
                .populate('dishes.dish')
                .then((fav)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav); 

                })
                             
            }, (err) => next(err));
           
          },(err) => next(err))
          .catch((err) => next(err));
          
        }

})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /Favorites/'+ req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {

Favorites.findOne({user : req.user._id})
.then((fav)=>{
  if(fav.dishes.indexOf({_id : req.params.dishId}) === -1){
                 fav.dishes.push(req.body);
                 fav.save()
                  .then((fav) => {
                    Favorites.findById(fav._id)
                    .populate('user')
                    .populate('dishes.dish')
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav); 
    
                    })
                 }, (err) => next(err))
                 .catch((err) => next(err)); 

                }
                else{
                    err = new Error('cannot insert duplicate dish');
                    err.status = 403;
                    res.setHeader('Content-Type', 'application/json');
                    return next(err);
                 }


}, (err) => next(err))
.catch((err) => next(err)); 

})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOneAndRemove({_id : req.params.dishId})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;