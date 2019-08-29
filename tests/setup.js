// jest timeout setup
jest.setTimeout(30000);

// common setup for jest test
require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
