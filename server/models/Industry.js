const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let IndustryModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const IndustrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  resource: {
    type: String,
    required: true,
  },
  resourceAmount: {
    type: Number,
    min: 1,
    required: true,
  },
  cost: {
    type: Number,
    min: 0,
    required: false,
  },
  level: {
    type: Number,
    min: 0,
    required: true,
  },
  levelUpCost: {
    type: Number,
    min: 0,
    required: true,
  },
  levelUpScaling: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

IndustrySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  resource: doc.resource,
  resourceAmount: doc.resourceAmount,
  cost: doc.cost,
  level: doc.level,
  levelUpCost: doc.levelUpCost,
  levelUpScaling: doc.levelUpScaling,
});

IndustrySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return IndustryModel.find(search).select('name resource resourceAmount level levelUpCost levelUpScaling').exec(callback);
};

IndustryModel = mongoose.model('Industry', IndustrySchema);

module.exports.IndustryModel = IndustryModel;
module.exports.IndustrySchema = IndustrySchema;
