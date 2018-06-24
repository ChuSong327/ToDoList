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

router.get('/:id', (req, res) => {
    const id = req.params.id;
     knex("todo").select().where("id", id).first().then(todo => {
        res.render('single', todo);
    })
});

router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
     knex("todo").select().where("id", id).first().then(todo => {
        res.render('edit', todo);
    })
});

function validTodo(todo){
    return typeof todo.Title === "string" && todo.Title.trim() !== "" &&
            typeof todo.Priority !== "undefined" && !isNaN(Number(todo.Priority));
};

function validateTodoInsertUpdateRedirect(req, res, callback) {
    if(validTodo(req.body)) {
        const todo = {
            Title: req.body.Title,
            Description: req.body.Description,
            Priority: req.body.Priority,
        };

        callback(todo);
    } else {
        //Respond with an error
        res.status(500);
        res.render("error", {
            message: "Invalid Todo"
        });
    }
}
router.post('/', (req, res) => {
    validateTodoInsertUpdateRedirect(req, res, (todo) => {
        todo.Date = new Date();
        const id = req.params.id;
        knex("todo").insert(todo, "id").then(id => {
            res.redirect(`/todo/${id}`);
        })
    })
});

router.put('/:id', (req, res) => {
   validateTodoInsertUpdateRedirect(req, res, (todo) => {
       todo.Date = new Date();
       const id = req.params.id;   
       knex("todo").where("id", id).update(todo, "id").then(id => {
           res.redirect(`/todo/${id}`);
       })
   })
});

module.exports = router;
