const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var collection =new Schema({
 dish : {
     type :mongoose.Schema.Types.ObjectId,
     ref : 'Dish'
 }

},{timestamps:true});

var favoriteSchema = new Schema({
 
 user : {
  type : mongoose.Schema.Types.ObjectId,
  ref : 'User'
 },

 dishes :[collection]

},{timestamps:true} );



var Favorites = mongoose.model('Favorite',favoriteSchema);
module.exports = Favorites;