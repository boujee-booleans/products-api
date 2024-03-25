const csv = require('csvtojson');
const path = require('path');
const jsonfile = require('jsonfile');

const csvFilePathRelated = path.join(__dirname, 'raw', 'related.csv');

csv()
  .fromFile(csvFilePathRelated)
  .then((jsonArray) => {
    const batchedAllRelatedProducts = [];
    let allRelatedProducts = [];
    let product_id = 0;
    let related_products;
    jsonArray.forEach((relatedObj, index) => {
      if (allRelatedProducts.length === 100000) {
        batchedAllRelatedProducts.push(allRelatedProducts);
        allRelatedProducts = [];
      }
      if (Number(relatedObj.current_product_id) !== product_id) {
        product_id = Number(relatedObj.current_product_id);
        related_products = [{related_product_id: Number(relatedObj.related_product_id)}];
        allRelatedProducts.push({ product_id, related_products })
      } else {
        related_products.push({related_product_id: Number(relatedObj.related_product_id)});
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
