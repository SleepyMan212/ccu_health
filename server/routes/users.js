var express = require('express');
var router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Users } = db;

const saltRounds = 10;
// const myPassword = 'password1';
// const testPassword = 'password2';

/* GET users listing. */
// router.get('/', function(req, res) {
//   res.send('respond with a resource');
// });

router.post('/login', async function(req, res) {
  const { username, password } = req.body
  const user = await Users.findOne({
    where: {
      username
    }
  })

  if(bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username, isAdmin:user.auth===1 }, process.env["JWT_SECRET"],{
      expiresIn: process.env["EXPIRES_IN"]
    });

    res.json({
      msg: 'Login success',
      status: 'success',
      data:{
        token
      }
    })
  } else {
    res.status(403).json({
      msg: 'Login failure',
      status: 'failure',
      data: {
        token: null,
        user: {
          username
        }
      }
    })
  }
})

router.get('/login', async function (req, res) {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env["JWT_SECRET"], (err, decode) => {
    if (err) {
      res.status(200).json({
        status: false,
        user: null
      });
    } else {
      res.status(200).json({
        status: true,
        user:  {...decode }
      });
    }
  });
})


router.post('/register', async function(req, res) {
  const { username, password, passwordAgain } = req.body
  try {
    if (password === passwordAgain) {
      const hash = bcrypt.hashSync(password, saltRounds);
      const data = await Users.create({
        username,
        password: hash,
      });
      res.status(201).json(data);
    } else {
      res.status(400).json({ msg: 'Please check your password be same.' })
    }
  } catch (error) {
      res.status(400).json({ msg: 'bad request' })
  }

});

module.exports = router;
