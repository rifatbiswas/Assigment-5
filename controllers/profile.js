

//import important lib
const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');

//module scoffolder
const controller = {};

//password encripeted
const Encrypt = (pass) => {
    return jwt.sign(pass, 'ostadBatch2');
}

//create Profile
controller.creatProfile = async (req, res) => {
    //The value is come requeist Body
    let {userName,name,country,email,password} = req.body;
    //All field is required verify
    if(!userName || !name || !country || !email || !password){
        return res.status(400).json({Error:"File the all Require fields"});
    }
    //verify user password
    if(password.length < 6){
        return res.status(400).json({Error:"Password mast be 6 cracter"});
    }
    //user name config
    let userNameModify = userName.charAt(0) === '@' ? userName.toLowerCase() : `@${userName.toLowerCase()}`;
    //verify user Name and email
    const userNameEx = await Profile.findOne({userName:userNameModify});
    const emailEx = await Profile.findOne({email});
    //user name and emaile verify
    if(userNameEx){
        return res.status(400).json({Error:'User Name has already use'});
    }else if(emailEx){
        return res.status(400).json({Error:'E-mail has already use'});
    }
    //passwoed hase
    const passwordHass = Encrypt(password);
    console.log(passwordHass)
    //user info
    let userInfo = {
        userName:userNameModify,
        name,
        country,
        email,
        password:passwordHass,
    };
    //profile cretade
    await Profile.create(userInfo, (error, data)=>{
        if (!error) {
            res.status(201).json({status:"success",Data:data});
        } else {
            res.status(400).json({status:"Failed",Error:error});
        }
    });
}

//login controller
controller.loging = async (req, res) => {
    //The value is come requeist Body
    let {userName,password} = req.body;
    //All field is required verify
    if(!userName || !password){
        return res.status(400).json({Error:"Enter userName and password Require fields"});
    }
    //user name config
    const userNameMode = userName.charAt(0) === '@' ? userName.toLowerCase() : `@${userName.toLowerCase()}`;
    //user profile Quarey
    const userExists = await Profile.findOne({userName:userNameMode});
    if(!userExists){
        return res.status(400).json({Error:'user not found, Please singup'});
    }
    //password verify
    const passwordUser = jwt.verify(userExists.password, 'ostadBatch2');
    const passwordIsCorrect = (passwordUser === password) ? password : false;
    //user resposn send
    if(userNameMode && passwordIsCorrect){
        const {_id, userName, name, country} = userExists;
        //creat auth token
        let paylode = {
            exp: Math.floor(Date.now()/1000) + (60*60*24),
            id:_id,
        }
        //make a Token
        const token = Encrypt(paylode);
        //respons user
        res.status(200).json(
            {
                Status:"success",
                Date:{
                    _id, 
                    userName, 
                    name, 
                    country,
                },
                Token:token,
            }
        ); 
    } else {
        res.status(404).json({status:"unauthorized"});
    };
}

//get user
controller.getProfile = async (req, res) => {
    //id is come auth middleware
    const id = req.headers['id'];
    //user find
    Profile.findOne(
        {_id:id},
        {_id:0,userName:1,name:1,country:1,email:1},
        (err, data)=>{
            if (!err) {
                //respons user
                res.status(200).json({status:"success",Data:data});
            } else {
                res.status(401).json({status:"faile",Error:err});
            }
        }
    );
}

//update profile
controller.updateProfile = async (req, res) => {
    //id is come auth middleware
    const id = req.headers['id'];
    //reruire data body
    let {userName,name, country, email} = req.body;
    //user name config
    let userNameModify = userName.charAt(0) === '@' ? userName.toLowerCase() : `@${userName.toLowerCase()}`;
    //verify user Name and email
    const userNameEx = await Profile.findOne({userName:userNameModify});
    if(userNameEx){
        return res.status(400).json({Error:'User Name has already use'});
    }
    //All field is required verify
    if(!userNameModify || !name || !country || !email){
        return res.status(400).json({Error:"Minemam One fields is Require "});
    }
    //cake user are exgiset
    let user = await Profile.find({_id:id});
    //user validate
    if(!user){
        return res.status(404).json({message:"User are not Exgit!"});
    }
    //chack update in a validet
    let updateData = {
        userName:userNameModify,
        name,
        country,
        email,
    }
    //save data base
    Profile.updateOne({_id:id},{$set:updateData},{upsert:true},(err, data)=>{
        if(!err){
            res.status(200).json({status:"success",data:data});
        }
        else {
            res.status(400).json({status:"fail",data:err});
        }
    });

}

//profile controller exporte
module.exports = controller;