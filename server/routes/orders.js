var express = require('express');
var router = express.Router();
const db = require('../models');
const dayjs = require('dayjs');
const { Orders, sequelize, Equipment} = db;

router.get('/', async function (req, res) {
    try {
        console.info(req.decode);
        const data = await Orders.findAll({
            include: [
                { model: Equipment, as: 'Equipment' }
            ],
        });
        
        res.json({
            data: buildData(data)
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: "bad request" });
    }
});

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const data = await Orders.findAll({
        where: { id },
        include: [
            { model: Equipment, as: 'Equipment' }
        ],
    });
    res.json({ data: buildData(data) });
});

router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const { body } = req;
    await Orders.update(
        body,
        { where: { id } }
    );
    res.status(204).json();
});

router.post('/', async function (req, res) {
    const { equipmentId, count, ...body } = req.body;
    try {
        const equipment  = await Equipment.findOne({
            where: {
                id: equipmentId
            }
        })
        if (!equipment) {
            res.status(400).json({ msg: 'no equipment' });
            return;
        }

        // check limit(need implemnt)
        if(!await checkLimit(equipmentId, equipment.count - count)) {
            res.status(400).json({ msg: 'equipment is no sufficient' });
            return;
        }

        const expiredAt = dayjs().add(equipment.duration, "day").format();
        const data = await Orders.create({ ...body, count, equipmentId, expiredAt });
        
        res.status(201).json({ data });
        
    } catch (error) {
        console.error(error);
        res.status(400).json({msg: "bad request"});
    }
});

router.delete('/:id', async function (req, res) {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const data = await Orders.destroy({
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

async function checkLimit (equipmentId, remainCount){
    const allCount = (await Orders.findAll({
        where: {
            equipmentId,
            status: false
        }
    })).reduce((acc, order) => acc+order.count, 0)
    return remainCount >= allCount;
}

function buildData(data) {
    return data.map((d) => {
        return {
            id: d.id,
            expiredAt: d.expiredAt,
            createdAt: d.createdAt,
            name: d.userName,
            email: d.email,
            status: d.status,
            phone: d.phone,
            count: d.count,
            equipmentId: d.Equipment.id,
            equipmentName: d.Equipment.name,
        }
    });
}

module.exports = router;
