var express = require('express');
var router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const db = require('../models');
const { Op, where } = require('sequelize');
const { sequelize, Users } = db;
const admin = require('./middleware/admin');
const auth = require('./middleware/auth');

const saltRounds = 10;

router.get('/', auth, admin, async function (req, res) {
  const users = await Users.findAll({
    attributes: { 
      exclude: ['password'],
      order: [['id', 'DESC']]
    },
    where: {
      auth: {
        [Op.ne]: 1 // 1 is for admin, 2 is for manager
      }
    }
  });
  res.status(200).json(users);
});

router.delete('/:id',auth, admin, async function (req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const data = await Users.destroy({
      where: {
        id
      }
    }, { transaction: t });
    await t.commit();
    res.json({ data }, 204);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "bad request" });
    t.rollback();
  }
});

router.put('/:id', auth, admin, async function (req, res) {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) res.status(200).json({msg: "No exist user"})
    const { body } = req;
    if (body.password && body.passwordAgain && body.password === body.passwordAgain) {
      const hash = bcrypt.hashSync(body.password, saltRounds);
      await Users.update({
        username: body.username,
        auth: body.auth,
        password: hash
      },{ 
        transaction: t,
        where: {id}
      });      
    } else {
      await Users.update({
        username: body.username,
        auth: body.auth,
      }, {
        transaction: t,
        where: { id }
      });
    }
    await t.commit();
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "bad request" });
    t.rollback();
  }
});

router.post('/login', async function(req, res) {
  const { username, password } = req.body
  const user = await Users.findOne({
    where: {
      username
    }
  })

  if(bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username, isAdmin: user.auth === 1, isManager: (user.auth === 1 || user.auth === 2) }, process.env["JWT_SECRET"],{
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
  console.log(authorization)
  if(typeof authorization === "undefined") {
    res.status(200).json({
      status: false,
      user: null
    });
  }
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


router.post('/register', auth, admin, async function(req, res) {
  const { username, password, passwordAgain, auth } = req.body
  console.log(req.body)
  try {
    if (password === passwordAgain && auth !== 1) {
      const hash = bcrypt.hashSync(password, saltRounds);
      const data = await Users.create({
        username,
        password: hash,
        auth
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
