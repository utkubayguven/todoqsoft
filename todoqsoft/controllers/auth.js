const bcrypt = require('bcrypt')

const User = require('../models/auth');
const jwt = require('jsonwebtoken');
const jwtSecret = "5572dceda3735dd62f2480e74d4a2e1f284b4ffd4be09cce6ad11af03f89d6698570b4";




exports.getLogin = (req, res, next) => {
    res.render('login');
}
  
exports.getRegister = (req, res, next) => {
    res.render('register')
}

exports.postRegister = async (req, res, next) => {
  const { email, password } = req.body;


  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      email,
      password: hash,
    })
      .then((user) => {
        const maxAge = 2 * 60 * 60;
        const token = jwt.sign( { id: user._id, email} , jwtSecret, {expiresIn: maxAge});
        res.cookie("jwt" , token , { httpOnly: true,  maxAge: maxAge * 1000 });
        return res.redirect('/login');
      })
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};


const verifyUser = async (email,password)=>{
  try {
      const maxAge = 2 * 60 * 60;
      const user = await User.findOne({email}).lean()
      if(!user){
          return {status:'error',error:'user not found'}
      }
      if(await bcrypt.compare(password,user.password)){
          token = jwt.sign({id:user._id,username:user.email,type:'User'},jwtSecret,{ expiresIn: maxAge})
          return {status:'ok',data:token}
      }
      return {status:'error',error:'invalid password'}
  }catch (error) {
      res.status(400).json({
        message: "User not successful logged",
        error: error.message,
    })
  }
}

exports.postLogin = async(req,res)=>{
  const {email,password}=req.body;
  const response = await verifyUser(email,password);
  if(response.status==='ok'){
      res.cookie('jwt',token,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
      res.redirect('/todos');
  }else{
      res.json(response);
  }
}

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err,decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role !== "User") {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          next()
        }
      }
    })
  } else {
    return res.status(401).json({ message: "Not authorized, token not available" })
  }
}










