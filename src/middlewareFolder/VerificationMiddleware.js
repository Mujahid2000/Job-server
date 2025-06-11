const  jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


const verifyToken = async ((req, resizeBy, next) =>{

})

jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');



module.exports = {
    verifyToken
}