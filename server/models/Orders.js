'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Equipment, {
        as: 'Equipment',
        foreignKey: 'equipmentId'
      })
    }
  }
  Orders.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]+$/i,
          msg: "請輸入正確的手機號碼"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "請輸入有效的 email"
        }
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        is: {
        }
      },
      comment: "false 未歸還;  true已歸還"
    },
    isExtend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sendedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    equipmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Equipment',
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
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};
