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
        foreignKey: 'LibraryId',
        as: 'libraryAdmin',
      });
      Library.hasMany(models.Book, {
        foreignKey: 'libraryId',
        as: 'libraryBooks',
      });
      Library.belongsToMany(models.User, { through: 'LibraryUsers' });
    }
  }
  Library.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Library',
  });
  return Library;
};