const mongoose = require('mongoose');

const db_url = process.env.DATABASE_URL || '127.0.0.1:27017';
const db_user = process.env.DATABASE_USERNAME || '';
const db_pwd = process.env.DATABASE_PASSWORD || '';
const db_auth = process.env.DATABASE_AUTHORIZATION_DATABASE || '';

const connection = mongoose.connect(`mongodb://${db_url}/productsAPI`, {
  user: db_user,
  pass: db_pwd,
  authSource: db_auth
});

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
