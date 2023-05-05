const dayjs = require('dayjs')
const db = require('../models');
const {
    send
} = require("./mail")
const { Orders, Equipment } = db;
const { Op } = require("sequelize");

async function sendNoitfy() {
    const nodifyDayStart = dayjs().format("YYYY-MM-DD");
    const nodifyDayEnd = dayjs().add(4, 'day').format("YYYY-MM-DD");
    try {
        const data = await Orders.findAll({
            where:{
                [Op.and]:{
                    expiredAt:{
                        [Op.gt]: nodifyDayStart,
                        [Op.lt]: nodifyDayEnd
                    }
                }
            },
            include: [
                { model: Equipment, as: 'Equipment' }
            ],
        })
        data.forEach(async (d) => {
            if (d.sendedAt === null) {
                send({
                    to: d.email,
                    subject: "衛保組器材租借",
                    html: `<b>您好 :</b><br>
							您所租借的器材即將到期請注意歸還日期以免逾期被罰。<br>
							<br>
							<b>器材名稱/數量：${d.Equipment.name} ${d.count}個<br>
								應還日期：${dayjs(d.expiredAt).format('YYYY-MM-DD')}</b><br>
							<br>
							國立中正大學衛生保健組<br>
							地址 : 62102嘉義縣民雄鄉大學路一段168<br>
							電話 : 05-2720411轉12345<br>
							電子郵件信箱 : health@ccu.edu.tw`,
                    attachments: []
                })
                d.comment += `${dayjs().format('YYYY-MM-DD')} 已發信提醒歸還<br>`;
                d.sendedAt = new Date();
                d.save();
            }
        })
    } catch (e) {
        console.error(e)
    }
}
async function sendExpire() {
    const data = await Orders.findAll({
        where: {
            [Op.and]: {
                expiredAt: {
                    [Op.lt]: dayjs()
                },
                status: false,
                sendedAt: {
                    [Op.ne]: dayjs()
                }
            }
        },
        include: [
            { model: Equipment, as: 'Equipment' }
        ],
    })
    data.forEach(async (d) => {
            send({
                to: d.email,
                subject: "衛保組器材租借",
                html: `<b>敬啟者您好 :</b><br>
                        您所借用之下列器材已逾期，請盡速歸還；經通知3次皆未歸還者，本組將禁止您3個月不得借用器材。<br>
                        <br>
                        <b>器材名稱/數量：${d.Equipment.name} ${d.count}個<br>
                            應還日期：${dayjs(d.expiredAt).format('YYYY-MM-DD')}</b><br>
                        <br>
                        國立中正大學衛生保健組<br>
                        地址 : 62102嘉義縣民雄鄉大學路一段168<br>
                        電話 : 05-2720411轉12345<br>
                        電子郵件信箱 : health@ccu.edu.tw`,
                attachments: []
            })
            d.comment += `${dayjs().format('YYYY-MM-DD')} 已發信提醒逾期<br>`;
            d.sendedAt = new Date();
            d.save();
    })

}
async function checkEquipmentRent() {
    sendNoitfy();
    sendExpire();
}

module.exports = {
    checkEquipmentRent,
}
