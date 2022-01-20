'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Library, {
        foreignKey: 'libraryId',
        onDelete: 'CASCADE',
      });
      Book.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  Book.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: ["^[a-z]+$",'i'],
          isAlpha: {
            args:true,
            msg: "name only contain alphabets"
          },
          notNull: true,
          notEmpty: true,
          min: 2,
          max: 30
      },
      get() {   //getter
        const rawValue = this.getDataValue('name');
        return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
      },
      set(value) {  
        this.setDataValue('name', value.toLowerCase());
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: ["^[a-z]+$",'i'],
          isAlpha: {
            args:true,
            msg: "author name only contain alphabets"
          },
          notNull: true,
          notEmpty: true,
          min: 2,
          max: 30
      },
      get() {   //getter
        const rawValue = this.getDataValue('author');
        return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
      },
      set(value) {  
        this.setDataValue('author', value.toLowerCase());
      }
    },
    description: DataTypes.STRING,
    is_available: DataTypes.BOOLEAN,
    libraryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};