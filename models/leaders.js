const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const leadSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    
    designation:{
        type: String,
        required:true
    },
    abbr:{
        type: String,
        required: true,
        
    },
    featured: {
        type: Boolean,
        default:false      
    },
},{
    timestamps: true
});

var Leaders = mongoose.model('leader', leadSchema);

module.exports = Leaders;