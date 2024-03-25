const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb://127.0.0.1:27017/productsAPI');

const relatedProductSchema = new mongoose.Schema({
  related_product_id: Number
});

const allRelatedProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true
  },
  related_products: [relatedProductSchema]
});

const AllRelatedProduct = mongoose.model('AllRelatedProduct', allRelatedProductSchema);