
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:[true, "User Name is required"],
            ref: "Profile",
        },
        TodoSubject:{
            type:String,
            toLowerCase:true,
            trim:true,
            required:[true, "Enter ToDo subject"],
        },
        TodoDescription:{
            type:String,
            toLowerCase:true,
            trim:true,
            required:[true, "Enter ToDo TodoDescription"],
        },
        TodoStatus:{
            type:String,
            toLowerCase:true,
            trim:true,
            enum:['new','runing','complete'],
            required:[true, "Enter ToDo TodoStatus"],
        },
        creatTodo:{
            type:Date,
        },
        updateTodo:{
            type:Date,
        }
    },
    {versionKey:false}
);

const Todo = mongoose.model('todos', todoSchema);

module.exports = Todo;