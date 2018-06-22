var express = require('express');
var router = express.Router();

const knex = require('../db/knex');

/* This router is mounted at http://localhost:3000/todo  */
router.get('/', function(req, res, next) {
    console.log("GET HERE!!!")
    knex("todo").select().then(todos => {
        console.log(todos)
        res.render('all', { todos: todos });
    })
});

module.exports = router;
