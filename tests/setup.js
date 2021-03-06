// jest timeout setup
jest.setTimeout(90000);
Number.prototype._called = {}; // temp fix for TypeError: Cannot create property '_called' on number '10'...

// common setup for jest test
require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
