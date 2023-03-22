var express = require('express');
var router = express.Router();
const db = require('../models');
const { Orders, OrderRecord, Users } = db;

router.get('/', async function (req, res) {
    try {
        const data = await OrderRecord.findAll();
        // const data = await OrderRecord.findAll({
        //     include: [
        //         { model: Orders, as: 'Order' },
        //         { model: Users, as: 'User' }
        //     ],
        //     order:[
        //         ['id']
        //     ]
        // });
        
        res.json({
            data
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "bad request" });
    }
});

module.exports = router;
