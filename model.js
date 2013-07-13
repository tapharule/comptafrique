var bootweb = require("bootweb"),
  fs = require("fs"),
  logger = bootweb.getLogger('S'),
  Schema = bootweb.mongoose.Schema,
  GridStore = bootweb.mongoose.mongo.GridStore,
  ObjectId = Schema.ObjectId,
  crypto = require('crypto'),
  Plan = new Schema({
    name: {
      type: String,
      required: true,
      index: {
        sparse: true
      }
    },
    classe: {
      type: String,
      required: true,
      index: {
        sparse: true
      }
    },
    number: {
      type: Number,
      required: true
    }
  }, {strict: false});

//template.markModified('element');
bootweb.mongoose.model('Plan', Plan);
