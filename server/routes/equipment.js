var express = require('express');
var router = express.Router();
const auth = require('./middleware/auth')
const db = require('../models');
const admin = require('./middleware/admin');
const { Equipment, Orders } = db;

// router.use(auth);
// router.use(admin);

router.get('/', async function (req, res) {
    const data = await Equipment.findAll();
    res.json({data});
});

router.get('/:id' ,async function (req, res) {
    const { id } = req.params;
    const data = await Equipment.findOne({ 
        where: { id },
        raw: true
    });
    const useCount = (await Orders.findAll({
        where: {
            equipmentId: id,
            status: false
        }
    })).reduce((acc, order) => acc + order.count, 0)
    res.json({ ...data, useCount });
});

router.put('/:id', auth, admin, async function (req, res) {
    const { id } = req.params;
    const { body } = req;

    await Equipment.update(
        body,
        { where: { id } }
    );

    res.status(204).json();
});

router.post('/', auth, admin, async function (req, res) {
    const { body } = req;
    const data = await Equipment.create(body);
    res.status(201).json({ data });
});

router.delete('/:id', auth, admin, async function (req, res) {
    const { id } = req.params;
    const data = await Equipment.destroy({
        where: {
            id
        }
    });
    res.status(204).json({ data });
});

module.exports = router;
