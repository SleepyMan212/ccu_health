var express = require('express');
var router = express.Router();
const db = require('../models');
const dayjs = require('dayjs');
const { Users, Orders, sequelize, Equipment, OrderRecord } = db;
const manager = require('./middleware/manager');
const auth = require('./middleware/auth');

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
router.get('/record', async function (req, res) {
    try {
        // const data = await OrderRecord.findAll();
        const data = await OrderRecord.findAll({
            attributes: ['status', 'createdAt', [sequelize.col('Order.userName'), 'username'], [sequelize.col('User.username'), 'borrowMan'], [sequelize.col('Order.id'), 'orderId']],
            include: [
                { model: Orders, as: 'Order', attributes: [], required: true, },
                { model: Users, as: 'User', attributes: [], required: true, }
            ],
            order:[
                ['id']
            ]
        });

        res.json({
            data
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

router.put('/:id', auth, manager, async function (req, res) {
    const { id } = req.params;
    const { count, equipmentId, ...body } = req.body;
    const { id: userId } = req.decode
    const t = await sequelize.transaction();
    try {
        const order = await Orders.findOne({where:{
            id,
            equipmentId,
            status: false
        }})
        let status = 4;
        if (body.status === true && (order && order.status === false)) {
            status = 1;
        }
        console.info(order === null ? count : count - order.count);
        const equipment = await checkEquipment(res, equipmentId, order === null ? count : count - order.count);
        // const equipment = await checkEquipment(res, equipmentId, oldEquipmentId === equipmentId ? count - oldCount : count);
        const expiredAt = dayjs(body.createdAt).add(equipment.duration, "day").format();
        await Orders.update(
            { ...body, count, expiredAt, equipmentId },
            { where: { id } },
            { transaction: t }
        );
        await OrderRecord.create({
            userId,
            orderId: id,
            status
        }, { transaction: t })
        await t.commit();
        res.status(204).json();
    } catch (error) {
        console.info(error)
        t.rollback();
        res.status(400).json({ msg: "bad request" });
    }
});

router.put('/:id/extend', auth, manager, async function (req, res) {
    const { id } = req.params;
    const { id: userId } = req.decode
    const t = await sequelize.transaction();
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
            { where: { id } },
            { transaction: t }
        );
        await OrderRecord.create({
            userId,
            orderId: id,
            status: 2
        }, { transaction: t })
        await t.commit();
        res.status(204).json();
    } catch (error) {
        console.info(error)
        t.rollback();
        res.status(400).json({ msg: "bad request" });
    }
});

router.post('/', auth, manager, async function (req, res) {
    const { equipmentId, count, ...body } = req.body;
    const {id: userId} = req.decode
    const t = await sequelize.transaction();
    try {
        const equipment = await checkEquipment(res, equipmentId, count);
        const expiredAt = dayjs().add(equipment.duration, "day").format();
        const data = await Orders.create({ ...body, count, equipmentId, expiredAt }, { transaction: t });
        
        await OrderRecord.create({
            userId,
            orderId: data.id,
            status:0
        }, { transaction: t })
        await t.commit();
        res.status(201).json({ data });
        
    } catch (error) {
        console.error(error);
        t.rollback();
        res.status(400).json({msg: "bad request"});
    }
});

router.delete('/:id', auth, manager, async function (req, res) {
    const t = await sequelize.transaction();
    const { id: userId } = req.decode
    try {
        const { id } = req.params;
        const data = await Orders.destroy({
            where: {
                id
            }
        }, { transaction: t });
        await OrderRecord.create({
            userId,
            orderId: id,
            status: 3
        }, { transaction: t })
        await t.commit();
        res.json({ data }, 204);
    } catch (error) {
        console.error(error);
        t.rollback();
        res.status(400).json({ msg: "bad request" });
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
            department: d.department,
        }
    });
}

function buildRecordData (data) {
    return data.map((d) => {
        return {
            id: d.id,
            borrowMan: d.User.username,
            department: d.Order.department,
        }
    });
}


module.exports = router;
