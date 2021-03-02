'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('Orders', 'equipmentId', { 
      type: Sequelize.INTEGER,
      references: {
        model: 'Equipment',
        key: 'id'
      },
      allowNull: false
    });
    
    queryInterface.addColumn('Orders', 'count', { 
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Orders', 'equipmentId');
    queryInterface.removeColumn('Orders', 'count');
  }
};
