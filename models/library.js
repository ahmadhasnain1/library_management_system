'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Library extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Library.hasOne(models.Admin, {
        foreignKey: 'libraryId',
        as: 'libraryAdmin',
      });
      Library.hasMany(models.Book, {
        foreignKey: 'libraryId',
        as: 'libraryBooks',
      });
      Library.belongsToMany(models.User, { through: 'LibraryUsers',  foreignKey: 'libraryId' });
    }
  }
  Library.init({
    name: {
      type: DataTypes.STRING,
      get() {   //getter
        const rawValue = this.getDataValue('name');
        return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
      },
      set(value) {  
        this.setDataValue('name', value.toLowerCase());
      }
    }
  }, {
    sequelize,
    modelName: 'Library',
  });
  return Library;
};