const jwt = require("jsonwebtoken");
require('dotenv').config();

function auth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(403).json({
            msg: 'forbidden'
        })
    } else {
        const token = authorization.split(' ')[1];
        if(!token) {
            res.status(401).json({
                msg: 'unauthorized'
            })
        } else {
            jwt.verify(token, process.env["JWT_SECRET"], (err, decode) => {
                if (err) {
                    console.info(err);
                    res.status(401).json({
                        msg: 'unauthorized'
                    });             
                } else {
                    req.decode = decode;
                    next();
                }
            });
        }
    }
}

module.exports = auth;
