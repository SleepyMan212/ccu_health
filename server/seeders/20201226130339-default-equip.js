'use strict';

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Equipment', [{
        name: '急救箱',
        count: 5,
        comment: `每人限借1個。<br>限急救證本人親借/親還，只可使用於各單位及系所舉辦之營隊、盃賽或其他已報備校內團體活動。`,
        card:'急救員證',
        duration: 7 ,
        createdAt: new Date(),
        updatedAt: new Date()
    },{
        name: '冷熱敷袋',
        count: 5,
        comment: `每人限借1個。
          <ul>
            <li>熱敷溫度請勿超過75℃，請先裝冷水再裝熱水以避免燙傷。</li>
            <li>本組上班時間提供冰敷用冰塊自取。</li>
          </ul>`,
        card: '學生證或服務證',
        duration: 7 ,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: '電子體溫計',
        count: 5,
        comment: `每人限借1個`,
        card: '學生證或服務證',
        duration: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: '拐杖',
        count: 5,
        comment: `每人限借2支。`,
        card: '學生證或服務證',
        duration: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: '輪椅',
        count: 5,
        comment: `<ul>
            <li>每人限借1台。</li>
            <li>輪椅負重上限為100Kg</li>
          </ul>`,
        card: '學生證或服務證',
        duration: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Equipment', {
      name: {
        [Op.in]: [
          '急救箱',
          '冷熱敷袋',
          '電子體溫計',
          '拐杖',
          '輪椅'
        ]
      }}, {});
  }
};
