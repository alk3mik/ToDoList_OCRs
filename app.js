'use-strict'

var express = require('express');
var bodyParser = require('body-parser');
var session= require('cookie-session');
var ejs = require('ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

// We use the sessions:
app.use(session({secret: 'todotopsecret'}))

// Create a todo-list in the *session* (as a empty array)
// if it doesn't already exsist (if for instance the user has just
// accessed the home page).
//
// This is a middleware:
// Pourquoi avoir créé un middleware ? Parce que c'est le seul moyen à
// ma disposition pour exécuter des fonctionnalités avant le chargement
// de n'importe quelle page. Et pour que le middleware "passe le bébé à
// son voisin", je dois finir impérativement par un appel à next() (la
// fonction suivante). Dans le cas présent, next() fait référence à
// .get('/todo', function() {})
//
.use((req, res, next) => {
	if (typeof(req.session.todolist) == 'undefined') {
		req.session.todolist = [];
	}
	next();
})

// We set the "public" (views in our case) directory from which we
// serve the static files. Like css/js/image ...
.use(express.static(__dirname + '/views'))

// Which routes do we need?
// Normally we need one route per functionality.
// Todo-list functionalities are for instance:
//     - list the tasks
//     - add one task
//     - delete one task

.get('/todo', (req, res) => {
	res.render('todo.ejs', {todolist: req.session.todolist});
})

.post('/todo/add/', urlencodedParser, (req, res) => {
	if (req.body.newtodo != '') {
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
})

.get('/todo/delete/:id', function(req, res) {
	if (req.params.id != '') {
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
})


// .delete('/todo/delete/:id' (req, res) => {
// 	res.send("with DELETE we'll remove the task number " + req.params.id + " from the list");
// });

.listen(8000);