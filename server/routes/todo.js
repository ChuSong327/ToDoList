const express = require('express');
const router = express.Router();

const knex = require('../db/knex');

/* This router is mounted at http://localhost:3000/todo  */
router.get('/', (req, res) => {
    knex("todo").select().then(todos => {
        res.render('all', { todos: todos });
    })
});

function respondAndRenderTodo(id, res, viewName) {
    if(typeof id !== "undefined") {
        knex("todo").select().where("id", id).first().then(todo => {
            res.render(viewName, todo)
        }); 
    } else {
        res.status(500);
        res.render('error', {
            message: 'Invalid ID'
        });
    }
};

router.get('/new', (req, res) => {
   res.render("new");
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    respondAndRenderTodo(id, res, 'single');
});

router.get('/:id/edit', (req, res) => {
    const id = req.params.id;
    respondAndRenderTodo(id, res, 'edit');
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
};

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

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    if(typeof id !== "undefined") {
        knex("todo").where("id", id).del().then(() => {
            res.redirect("/todo");
        });
    } else {
        res.status(500);
        res.render("error", {
            message: "Invalid ID"
        });
    }
})

module.exports = router;
