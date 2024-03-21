const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://127.0.0.1:27017/productsAPI');

const featureSchema = new mongoose.Schema({
  feature: String,
  value: String
});

const productSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true
  },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [featureSchema]
});

const Product = mongoose.model('Product', productSchema);