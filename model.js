var bootweb = require("bootweb"),
  fs = require("fs"),
  logger = bootweb.getLogger('comptafrique'),
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
  }, {strict: false}),
  Accounts = new Schema({
    name: {
      type: String,
      required: true,
      index: {
        sparse: true
      }
    },
    type: {
      type: ObjectId, // reference au type de compte dans le plan
      required: true,
      index: {
        sparse: true
      }
    },
    currency: {
      type: String,
      required: true
    },
    creator: {
      type: ObjectId, // reference user qui crée le compte
      required: true,
      index: {
        sparse: true
      }
    },
    creation_date: {
      type: Date,
      required: true,
      index: {
        sparse: true
      }
    }
  }, {strict: false});

//template.markModified('element');
bootweb.mongoose.model('Plan', Plan); // enregistre le modele plan
bootweb.mongoose.model('Accounts', Accounts); // enregistre le modele des  comptes


