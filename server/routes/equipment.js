var express = require('express');
var router = express.Router();
const auth = require('./middleware/auth')
const db = require('../models');
const admin = require('./middleware/admin');
const { Equipment } = db;

router.use(auth);
router.use(admin);

router.get('/', async function (req, res) {
    const data = await Equipment.findAll();
    res.json({data});
});

router.get('/:id' ,async function (req, res) {
    const { id } = req.params;
    const data = await Equipment.findAll(
        { where: { id } }
    );
    res.json({ data });
});

router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const { body } = req;

    await Equipment.update(
        body,
        { where: { id } }
    );

    res.status(204).json();
});

router.post('/', async function (req, res) {
    const { body } = req;
    const data = await Equipment.create(body);
    res.status(201).json({ data });
});

router.delete('/:id', async function (req, res) {
    const { id } = req.params;
    const data = await Equipment.destroy({
        where: {
            id
        }
    });
    res.status(204).json({ data });
});

module.exports = router;
