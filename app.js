const express=require('express');//returns a function and storing it in express
const { result } = require('lodash');
const app=express();//invoking that function to create an instance of an express app
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog=require('./models/blog');

//connect to mongodb
const dbURI='mongodb+srv://blog_user:allhaillelouch@project.wwyxn7c.mongodb.net/blogs_website?retryWrites=true&w=majority';

mongoose.connect(dbURI,{ useNewUrlParser:true, useUnifiedTopology:true})//asynchronous
    .then((result)=>app.listen(3000))//3000 port number, localhost automatically, listen for requests only when connection to db is successful 
    .catch((err)=>console.log(err));//if error, then show error
//listen for requests only after connection with database has been established, so that we can present all the blogs before loading the page
//second argument also passed as object to prevent depracation warning, ASYNCHRONOUS TASK (like a promise)

//register view engine 
//WITH EJS, WE CAN CREATE DYNAMIC HTML PAGES AND DO STUFF LIKE WE DID IN IN JS DOM, LIKE IN FRONT END BUT ON SERVER
app.set('view engine', 'ejs'); 

//middleware & static files eg-css, images
app.use(express.static('public'));//public folder is now accessible from front end  
app.use(express.urlencoded({extended:true}));//takes all the url encoded data that comes along when we send a post request to '/view' by filling and submitting the form and passes that into an object that we can use in the req object in the callback function of post request

app.get('/'/*first argument is what url the user is trying to access, in this case, homepage*/,(req,res)=>{
    //res.send('<p>hello</p>');//infers the type of content we are trying to respond with (plain text or html or json) so we dont need to setHeader and define content type explicitly AND also automatically infers the status code of the message
    //res.sendFile('./index.html',{root:__dirname}); we have to mention the root and then relative position w.r.t. root
    res.render('index',{title:'Home'});//same as above line, with express & ejs we take a view, render it, and send it back to the browser, and now express is gonna look inside the 'views' folder automatically, its gonna find this file, and use the ejs view engine to render it & send it back
}); 

app.get('/about',(req,res)=>{
    res.render('about',{title:'About Us'});//aslo sets the status code to 301
});
 
app.get('/create',(req,res)=>{
    res.render('create',{title:'Make Your Blog'});//aslo sets the status code to 301
});

app.get('/view',(req,res)=>{
    Blog.find().sort({createdAt:-1})
        .then((result)=>{
            res.render('view',{title:'All Blogs',blogs:result})
        })
        .catch((err)=>{
            console.log(err)
        })
});

app.post('/view',(req,res)=>{
    //req.body; this has ALL THE DATA as an object with key-value pairs. keys=names and values are string data.
    const blog=new Blog(req.body)
    blog.save()   //saves this to the database
        .then((result)=>{
            res.redirect('/view')
        })
        .catch((err)=>{
            console.log(err)
        })
});

//route parameters are the variable parts of an url or routes
app.get('/view/:id'/*id is the name of the route parameter, ':' tells that the next part is route parameter and is variable*/,(req,res)=>{
    const id=req.params.id;//extracting the route parameter which is named id by us
    Blog.findById(id)
        .then(result=>{
            res.render('details',{title:'Blog Details', blog:result})
        })
        .catch(err=>{
            console.log(err)
        })
});

app.delete('/view/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result=>{
            res.json({redirect:'/view'})
        })
        .catch(err=>console.log(err))
});

//404 page not found
app.use((req,res)=>{//use is a middleware function & runs for every request, BUT only runs if the request reaches this point in the code, else if one of the above get functions execute then it stops
    //res.status(404).sendFile('./404errorpage.html',{root:__dirname});
    res.status(404).render('404',{title:'Error 404'});
});//we have to explicitly assign statusCode=404 as express doesnt know we are doing this for error page 
