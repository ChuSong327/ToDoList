const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

/* This router is mounted at http://localhost:3000/todo  */
router.get('/', (req, res) => {
    knex("todo").select().then(todos => {
        res.render('all', { todos: todos });
    })
});

router.get('/new', (req, res) => {
   res.render("new");
});

function validTodo(todo){
    return typeof todo.Title === "string" && todo.Title.trim() !== "" &&
            typeof todo.Priority !== "undefined" && !isNaN(Number(todo.Priority));
};

router.post('/', (req,res) => {
    if(validTodo(req.body)){
        const todo = {
            Title: req.body.Title,
            Description: req.body.Description,
            Priority: req.body.Priority,
            Date: new Date()
        };
        knex("todo").insert(todo, "id").then(id => {
            res.redirect(`todo/${id}`);
        } )
    } 
    else {
        res.status(500);
        res.render("error", {
            message: "Invalid Todo"
        })
    }
});

module.exports = router;
