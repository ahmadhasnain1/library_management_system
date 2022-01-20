'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
    */

      await queryInterface.bulkInsert('Libraries', [{
        name: 'InvoZone Library',
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     */

     await queryInterface.bulkDelete('Libraries', null, {});
  }
};
