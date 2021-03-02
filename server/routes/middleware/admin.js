require('dotenv').config();
const db = require('../../models');
const { Users } = db;

async function admin(req, res, next) {
    const { username } = req.decode;
    const user = await Users.findOne({
        where: {
            username
        }
    })
    
    if(user.auth === 1) {
        next();
    } else {
        res.status(403).json({
            msg: 'forbidden'
        })
    }
}

module.exports = admin;
