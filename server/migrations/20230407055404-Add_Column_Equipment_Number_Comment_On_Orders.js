'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try {
      await queryInterface.addColumn('Orders', 'eqipmentNumberComment', {
        type: Sequelize.STRING,
        defaultValue: ''
      });
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Orders', 'eqipmentNumberComment');
  }
};
