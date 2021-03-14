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
            order:[
                ['id']
            ]
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
    const { count, equipmentId, ...body } = req.body;
    try {
        const order = await Orders.findOne({where:{
            id,
            equipmentId,
            status: false
        }})
        console.info(order === null ? count : count - order.count);
        const equipment = await checkEquipment(res, equipmentId, order === null ? count : count - order.count);
        // const equipment = await checkEquipment(res, equipmentId, oldEquipmentId === equipmentId ? count - oldCount : count);
        const expiredAt = dayjs(body.createdAt).add(equipment.duration, "day").format();
        await Orders.update(
            { ...body, count, expiredAt, equipmentId },
            { where: { id } }
        );
        res.status(204).json();
    } catch (error) {
        console.info(error)
    }
});

router.put('/:id/extend', async function (req, res) {
    const { id } = req.params;
    try {
        const { expiredAt: oldExpiredAt, isExtend, equipmentId  } = await Orders.findOne({where:{
            id
        }})
        // console.info(oldCount);
        if(isExtend === true) {
            res.status(204).json();
            return;
        }
        const equipment = await checkEquipment(res, equipmentId, 0);
        const expiredAt = dayjs(oldExpiredAt).add(equipment.duration, "day").format();
        await Orders.update(
            { expiredAt, isExtend: true },
            { where: { id } }
        );
        res.status(204).json();
    } catch (error) {
        console.info(error)
    }
});

router.post('/', async function (req, res) {
    const { equipmentId, count, ...body } = req.body;
    try {
        const equipment = await checkEquipment(res, equipmentId, count);
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

async function checkEquipment (res, equipmentId, count) {
    const equipment = await Equipment.findOne({
        where: {
            id: equipmentId
        }
    })
    if (!equipment) {
        res.status(200).json({ msg: '沒有該設備' });
        // res.status(200).json({ msg: 'no equipment' });
        return;
    }

    // check limit(need implemnt)
    if (!await checkLimit(equipmentId, equipment.count - count)) {
        res.status(200).json({ msg: '設備數量不足' });
        // res.status(200).json({ msg: 'equipment is no sufficient' });
        return;
    }

    return equipment
}
function buildData(data) {
    return data.map((d) => {
        return {
            id: d.id,
            expiredAt: d.expiredAt,
            createdAt: d.createdAt,
            sendedAt: d.sendedAt,
            userName: d.userName,
            email: d.email,
            status: d.status,
            phone: d.phone,
            count: d.count,
            equipmentId: d.Equipment.id,
            equipmentName: d.Equipment.name,
            comment: d.comment,
            isExtend: d.isExtend,
        }
    });
}

module.exports = router;
