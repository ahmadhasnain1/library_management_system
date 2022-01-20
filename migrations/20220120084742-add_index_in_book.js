'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.addIndex('Books', ['name', 'author', 'libraryId'], {
      name: 'book_name_author_library',
      unique: true
     });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
     await queryInterface.removeIndex('Books', 'book_name_author_library');
  }
};
