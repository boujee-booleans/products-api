const csv = require('csvtojson');
const path = require('path');
const jsonfile = require('jsonfile');

const csvFilePathFeatures = path.join(__dirname, 'raw', 'features.csv');
const csvFilePathProduct = path.join(__dirname, 'raw', 'product.csv');

csv()
  .fromFile(csvFilePathFeatures)
  .then((jsonArray) => {
    let product_id = 0;
    const allFeatures = {};
    let features = [];
    jsonArray.forEach((featureObj, index) => {
      const { feature } = featureObj;
      let { value } = featureObj;
      if (value === 'null') {
        value = null;
      }
      if (Number(featureObj.product_id) !== product_id) {
        product_id = Number(featureObj.product_id);
        features = [{ feature, value }];
        allFeatures[product_id] = features;
      } else {
        features.push({ feature, value });
      }
    });
    csv()
      .fromFile(csvFilePathProduct)
      .then((jsonArray) => {
        const batchedAllProducts = [];
        let allProducts = [];
        jsonArray.forEach((productObj, index) => {
          if (allProducts.length === 100000) {
            batchedAllProducts.push(allProducts);
            allProducts = [];
          }
          product_id = Number(productObj.id);
          const default_price = Number(productObj.default_price);
          features = allFeatures[product_id] || [];
          const { name, slogan, description, category } = productObj;
          const productInfo = { product_id, name, slogan, description, category, default_price, features };
          allProducts.push(productInfo);
        });
        if (allProducts.length > 0) {
          batchedAllProducts.push(allProducts);
        }
        batchedAllProducts.forEach((allProducts, index) => {
          const jsonFilePathProduct = path.join(__dirname, 'transformed', `product${index + 1}.json`);
          jsonfile.writeFile(jsonFilePathProduct, allProducts)
            .then(console.log('File created: ', jsonFilePathProduct));
        });
      });
  });



