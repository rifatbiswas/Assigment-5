
//require jwt lib
const jwt = require('jsonwebtoken');

//auth middleware
exports.auth = (req,res,next) => {
    let token = req.headers['token'];
    jwt.verify(token,'ostadBatch2', (err, decoded)=>{
        // console.log(decoded)
        if (!err) {
            req.headers.id = decoded.id;
            next();
        } else {
            res.status(401).json({status:"unauthorized"})
        }
    });
}