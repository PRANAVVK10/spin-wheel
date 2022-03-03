const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const spinSchema = mongoose.Schema(
  {

    user:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'User',
      required:true
    },
    username:{
      type:String,
      required:true

    }
  
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
spinSchema.plugin(toJSON);

spinSchema.statics.spinExists = async function (id) {
  const spin = await this.findOne({  user : id }).populate('user');
  return spin;
};

/**
 * @typedef spin
 */
const spin = mongoose.model('Spin', spinSchema);

module.exports = spin;
