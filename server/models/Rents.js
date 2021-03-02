/*
This code is unused.
It is Combind to Orders table
*/
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.myAssociation = this.belongsTo(models.Orders)
      this.myAssociation = this.belongsTo(models.Orders, {
        as:"Orders",
        foreignKey: 'orderId',
        // onDelete: 'cascade'  
      })
      // this.hasMany(models.Equipment)
      this.belongsTo(models.Equipment, { 
        as: 'Equipment',
        foreignKey: 'equipmentId'
      })
    }
  }
  Rents.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    equipmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Equipment',
        key: 'id'
      },
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Order',
        key: 'id'
      },
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]+$/i,
          msg: "請輸入數字"
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Rents',
  });
  return Rents;
};
