const bcrypt = require('bcrypt');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Book, {
        foreignKey: 'userId',
        as: 'userBooks',
      });
      User.belongsToMany(models.Library, { through: 'LibraryUsers' });
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is: ["^[a-z]+$",'i'],
          isAlpha: {
            args:true,
            msg: "Fullname only contain alphabets"
          },
          notNull: true,
          notEmpty: true,
          min: 2,
          max: 30
      },
      get() {   //getter
        const rawValue = this.getDataValue('full_name');
        return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
      },
      set(value) {  
        this.setDataValue('full_name', value.toLowerCase());
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
          isEmail: true,
          notNull: true,
          notEmpty: true,
          min: 2,
          max: 30
      },
      set(value) {   
        this.setDataValue('email', value.toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
          notNull: true,
          notEmpty: true,
          min: 5,
          max: 200
      },
      set(value) {   //setter
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
    token: {
      type: DataTypes.STRING(255)
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};