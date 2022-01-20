'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
    */

     await queryInterface.bulkInsert('Admins', [{
      full_name: 'Ahmad',
      email: 'ahmad.hasnain@invozone.com',
      password: 'Abc123',
      libraryId: 1
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
     await queryInterface.bulkDelete('Admins', null, {});
  }
};
