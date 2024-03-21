const csv = require('csvtojson');
const path = require('path');
const jsonfile = require('jsonfile');

const csvFilePathFeatures = path.join(__dirname, 'raw', 'features-mini.csv');

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
        product_id = Number(relatedObj.product_id);
        features = [{ feature, value }];
        allFeatures[product_id] = features;
      } else {
        features.push(Number(relatedObj.related_product_id));
      }
    });
    csv()
      //do something with products data and allFeatures
  })




  .then((jsonArray) => {
    const batchedAllProducts = [];
    let allProducts = [];
    let product_id = 0;
    let features;
    jsonArray.forEach((relatedObj, index) => {
      if (allRelatedProducts.length === 100000) {
        batchedAllRelatedProducts.push(allRelatedProducts);
        allRelatedProducts = [];
      }
      if (Number(relatedObj.current_product_id) !== product_id) {
        product_id = Number(relatedObj.current_product_id);
        related_products = [Number(relatedObj.related_product_id)];
        allRelatedProducts.push({ product_id, related_products })
      } else {
        related_products.push(Number(relatedObj.related_product_id));
      }
    });
    if (allRelatedProducts.length > 0) {
      batchedAllRelatedProducts.push(allRelatedProducts);
    }
    batchedAllRelatedProducts.forEach((allRelatedProducts, index) => {
      const jsonFilePathRelated = path.join(__dirname, 'transformed', `related${index + 1}.json`);
      jsonfile.writeFile(jsonFilePathRelated, allRelatedProducts)
        .then(console.log('File created: ', jsonFilePathRelated));
    })
  })
