//this file for model and schema of a data
const mongoose = require('mongoose');
const Schema = mongoose.Schema;//(constructor function) schema defines the structure of a data/document that we'll be storing in the collection, model wraps around it & provides us with an interface by which we communicate with the database collection

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},{timestamps:true});//automatically generates timestamp properties for us, everytime we update or create a blog document, its gonna auto assign values of those properties for us

//name of model typically start with capital letter
//first argument=name of model/collection, IMP BECAUSE ITS GONNA LOOK AT THIS ARGUMENT, ITS GONNA PLURALIZE IT (blogs) AND THEN LOOK FOR THAT COLLECTION INSIDE THE DATABASE (ONLINE IN WEBSITE) WHENEVER WE USE THIS MODEL IN THE FUTURE TO COMMUNICATE WITH THE DATABASE 
const Blog = mongoose.model('Blog',blogSchema);
module.exports=Blog; 