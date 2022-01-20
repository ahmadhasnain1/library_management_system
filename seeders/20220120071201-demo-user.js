var fs = require('fs'); 
var path = require('path');
const bcrypt = require('bcrypt');

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
    */

     var data = fs.readFileSync(path.resolve( __dirname,"./users.csv"), "utf8");
     let record_to_insert = [];
     // (C) STRING TO ARRAY
     data = data.split("\n"); // SPLIT ROWS
     for (let i in data) { // SPLIT COLUMNS
       data[i] = data[i].split(",");
       record_to_insert.push({full_name:data[i][0], email:data[i][2], password:bcrypt.hashSync(data[i][3], 10), createdAt : new Date(), updatedAt : new Date()})
     }
 
      await queryInterface.bulkInsert('Users', record_to_insert, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */

     await queryInterface.bulkDelete('Users', null, {
      where: {
        id: {
         [Sequelize.Op.between]: [2, 4]                   // BETWEEN 18 AND 22
        }
      }
    });
  }
};
