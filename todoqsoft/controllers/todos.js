const Todo = require("../models/todos");

exports.getTodos = (req,res)=>{
    Todo.find()
    .then(result =>{
        res.render("todos.ejs",{data:result})
    })
}


exports.postTodos= (req,res)=>{
    const todo = new Todo({
        todo : req.body.todoV
    })
    todo.save()
    .then(result=>{
        res.redirect("/todos")
    })
}

exports.deleteTodos = (req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
    .then(result =>{
        console.log(result)
    })
}

