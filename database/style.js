const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://127.0.0.1:27017/productsAPI');

const photoSchema = new mongoose.Schema({
  thumbnail_url: String,
  url: String
});

const skuSchema = new mongoose.Schema({
  sku_id: Number,
  sku_info: {
    quantity: Number,
    size: String
  }
});

const styleSchema = new mongoose.Schema({
  style_id: {
    type: Number,
    unique: true
  },
  name: String,
  original_price: Number,
  sale_price: Number,
  'default?': Boolean,
  photos: [photoSchema],
  sku: [skuSchema]
});

const allStyleSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true
  },
  results: [styleSchema]
});

const AllStyle = mongoose.model('AllStyle', allStyleSchema);