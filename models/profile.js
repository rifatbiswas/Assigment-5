
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
    {
        userName:{
            type:String,
            unique:[true, "User name is allrady taken"],
            required:[true, "enter your users name"],
        },
        name:{
            type:String,
            trim:true,
            toLowerCase:true,
            required:[true, "Enter your name"]
        },
        country:{
            type:String,
            trim:true,
            toLowerCase:true,
            required:[true, "Enter your country"]
        },
        email:{
            type:String,
            trim:true,
            unique:[true, "This emile is alradey use"],
            required:[true, "Enter your email"],
            match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "please enter a valide emile"]
        },
        password:{
            type:String,
            trim:true,
            minLength:[6, "Password is minemam 6 crecters"],
        }
    },
    {versionKey:false}
);

const Profile = mongoose.model('users', profileSchema);
 
module.exports = Profile;