const express = require("express");
const app = express();
const server = require('http').createServer(app);
let io = require('socket.io').listen(server);

users = [];
connections = [];

//the body-parser middleware
app.use(require("body-parser")());

//static files middleware (css,js,images)
app.use(express.static(__dirname+'/public'));

//handle the views and the layout
let handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//set the PORT
app.set('port',process.env.PORT || 6040);

//the root webpage
app.get('/',(req,res) =>{
	res.render('index');
});

//the about webpage
app.get('/about',(req,res)=>{
	res.render('about');
});

//the login form for user login
app.get('/login',(req,res)=>{
	res.render('login');
});

/*
* process login form && redirect
* the form action is process && form
* name is login.It uses the post method
* it will redirect the user to his account
*/
app.post('/process',(req,res)=>{
	console.log("Below are the user login details")
	console.log(`name :${req.body.username}`);
	console.log(`Password :${req.body.password}`);
	res.redirect(303,'/account')
});

/*
*User redirect to thank-you
*if user in database
*/
app.get('/thank-you',(req,res)=>{
	res.render('thank-you');
});

/*
*User redirect to register form
*if user not in database
*/
app.get('/register',(req,res)=>{
	res.render('register');
});

/*
* process register form && redirect
* the form action is createAccount && form
* name is register.It uses the post method
* it will redirect the user to the login form
*/
app.post('/createAccount',(req,res)=>{
	console.log(`first name :${req.body.fname}`);
	console.log(`last name  :${req.body.lname}`);
	console.log(`email      :${req.body.email}`);
	console.log(`username   :${req.body.username}`);
	console.log(`password   :${req.body.password}`);
	res.redirect(303,'/thank-you');
});

//user's account
app.get('/account',(req,res)=>{
	res.render('account');
	msg = req.body.message;
	console.log(msg)
});

//the page-not-found error 404 middleware 
app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

//the internal-error 500 middleware
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

//connections and sockets
io.on('connection',function(socket){
	connections.push(socket);
	console.log('Connected');
	console.log('connected: %s sockets',connections.length);
});

//the server 
server.listen(app.get('port'),function(){
	console.log(`Express server started in ${app.get('env')} on http://localhost:`
		+`${app.get('port')}.Press CTRL+C to terminate the connection...`);
});