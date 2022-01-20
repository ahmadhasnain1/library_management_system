'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     */
     await queryInterface.addColumn(
      'Books', // name of Source model
      'publishing_date', // name of the key we’re adding
      {
        type: Sequelize.DATE,
      }
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
     await queryInterface.removeColumn('Books','publishing_date');
  }
};
