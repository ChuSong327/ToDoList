// When the code is run on Heroku (for example), the environment will be "production". 
const environment = process.env.NODE_ENV || "development"; 
const config = require('../knexfile.js')[environment];
module.exports = require("knex")(config); 