var bootweb = require("bootweb"),
  fs = require("fs"),
  logger = bootweb.getLogger('S'),
  Schema = bootweb.mongoose.Schema,
  GridStore = bootweb.mongoose.mongo.GridStore,
  ObjectId = Schema.ObjectId,
  crypto = require('crypto'),
  Store = new Schema({
    name: {
      type: String,
      required: true,
      index: {
        sparse: true
      }
    },
    prefix: {
      type: String,
      required: true,
      index: {
        sparse: true
      }
    },
    published: {
      type: Boolean,
      default: false
    },
    config: {
      type: Schema.Types.Mixed
    }
  }, {strict: false});

//template.markModified('element');
bootweb.mongoose.model('OnlineStore', Store);
exports.Item = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      sparse: true
    }
  },
  title: {
    type: String,
    required: true,
    index: {
      sparse: true
    }
  },
  price: {
    type: Number,
    required: true,
    index: {
      sparse: true
    }
  },
  description: {
    type: String,
    required: false,
    index: {
      sparse: true
    }
  },
  published: {
    type: Boolean,
    required: true,
    index: {
      sparse: true
    },
    default: false
  },
  modified: {
    type: Boolean,
    required: true,
    index: {
      sparse: true
    },
    default: true
  },
  public_data: {
    type: Schema.Types.Mixed
  },
  mainPic: String
});
exports.Item.methods.setMainPic = function(file, callback) {
    var item = this;

    logger.info('start setMainPic method');
    this.saveFile(file, function(err, savedFile) {
        item.mainPic = file.name; 
        item.save(function(err){
            callback(err,savedFile);
        });
    });
};
exports.Item.methods.saveFile = function(file, callback) {
    //logger.info(_.inspect(fileData));
    //callback(null, null)
    var 
        conn = bootweb.getConnection(),
        item = this,
        fileName = "item" + "/" + this._id + "/" + file.name;
    logger.info('start saveFile method');
    var gsFile = new GridStore(conn.db, fileName ,"w",{
    "content_type": file.type,
        "metadata":{
            "owner": item.name
        }
    });
    gsFile.open(function(err,gsFile) {
        gsFile.write(file.binary, function(err,file){
            gsFile.close(function(err) {
                if (err !== null) {
                    return callback(err);
                }
                callback(err,file, fileName);
            });
        });
   });
};

exports.Item.methods.getPic = function(filename,callback) {
  var conn = bootweb.getConnection(),
    fileName = "item" + "/" + this._id + "/" + filename,
		file = new GridStore(conn.db,fileName,"r");
	logger.info("getPic : filename: " + fileName );
	file.open(function(err,file) {
        if (err !== null) {
            return callback(err);
        }
        file.read(function(err,data){
            if (err !== null) {
                return callback(err);
            }
            file.close(function(err) {
                if (err !== null) {
                    return callback(err);
                }
                callback(err,{
                    type: file.contentType,
                    binary: data
                });
            });
        });
   });
};
exports.Item.methods.getPicList = function(callback) {
	var conn = bootweb.getConnection(),
    item = this;
	conn.db.collection("fs.files", function(err, filesColl) {
		if (err !== null) {
			return callback(err);
		}
		filesColl.find({metadata: {owner: item.name}}).toArray( function(err, files) {
			var pics = [];
			files.forEach(function(p) {
				pics.push({
					filename: p.filename.substr( p.filename.lastIndexOf("/") + 1 )
				});
			});
			return callback(err,pics);
		});
	});
};
exports.Item.methods.getMainPic = function(callback) {
    //logger.info(_.inspect(fileData));
    //callback(null, null)
    var fileName = this.mainPic;
    if (fileName !== undefined) {
        this.getPic(fileName,callback);
        
    } else {
        fs.readFile(__dirname + '/../static/images/default_image.png',function(err,data) {
            callback(null,{type: "image/png",binary: data});
        });
    }
};
exports.Payment = new Schema({
  paymentId: {
    type: String,
    required: false,
    index: {
      sparse: true
    }
  },
  token: {
    type: String,
    required: false,
    index: {
      sparse: true
    }
  },
  payerID: {
    type: String,
    required: false,
    index: {
      sparse: true
    }
  },
  state: {
  type: String,
    required: true,
  },
  error: {
    type: Boolean,
    required: true,
    default: false,
    index: {
      sparse: true
    }
  },
  token: {
      type: String,
      required: false,
      index: {
        sparse: true
      }
    },
  createRequest: {
    type: Schema.Types.Mixed
  },
  createResponse: {
    type: Schema.Types.Mixed
  },
}, {strict: false});