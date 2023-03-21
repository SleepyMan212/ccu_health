require('dotenv').config();
const db = require('../../models');
const { Users } = db;

async function admin(req, res, next) {
    if(typeof req.decode === "undefined") {
        res.status(403).json({
            msg: 'forbidden'
        })
    } else {
        const { username } = req.decode;
        const user = await Users.findOne({
            where: {
                username
            }
        })
        
        if (user && (user.auth === 2 || user.auth === 2)) {
            next();
        } else {
            res.status(403).json({
                msg: 'forbidden'
            })
        }
    }
}

module.exports = admin;
