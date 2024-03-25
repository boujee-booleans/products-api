const mongoose = require('mongoose');

const database_url = process.env.DATABASE_URL || '127.0.0.1:27017';

const connection = mongoose.connect(`mongodb://${database_url}/productsAPI`);

// products collection
const featureSchema = new mongoose.Schema({
  feature: String,
  value: String
});

const productSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    index: true,
    unique: true
  },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  features: [featureSchema]
});

const Product = mongoose.model('Product', productSchema);

// relatedproducts collection
const relatedProductSchema = new mongoose.Schema({
  related_product_id: Number
});

const allRelatedProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    index: true,
    unique: true
  },
  related_products: [relatedProductSchema]
});

const AllRelatedProduct = mongoose.model('AllRelatedProduct', allRelatedProductSchema);

// styles collection
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
  skus: [skuSchema]
});

const allStyleSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    index: true,
    unique: true
  },
  results: [styleSchema]
});

const AllStyle = mongoose.model('AllStyle', allStyleSchema);


exports.Product = Product;
exports.AllRelatedProduct = AllRelatedProduct;
exports.AllStyle = AllStyle;
