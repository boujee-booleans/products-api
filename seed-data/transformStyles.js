const csv = require('csvtojson');
const path = require('path');
const jsonfile = require('jsonfile');

const csvFilePathStyles = path.join(__dirname, 'raw', 'styles.csv');
const csvFilePathPhotos = path.join(__dirname, 'raw', 'photos.csv');
const csvFilePathSkus = path.join(__dirname, 'raw', 'skus.csv');

// transform photos data
csv()
  .fromFile(csvFilePathPhotos)
  .then((jsonArray) => {
    let style_id = 0;
    const allPhotos = {};
    let photos = [];
    jsonArray.forEach((photoObj, index) => {
      const { thumbnail_url, url } = photoObj;
      if (Number(photoObj.styleId) !== style_id) {
        style_id = Number(photoObj.styleId);
        photos = [{ thumbnail_url, url }];
        allPhotos[style_id] = photos;
      } else {
        photos.push({ thumbnail_url, url });
      }
    });
    // transform skus data
    csv()
      .fromFile(csvFilePathSkus)
      .then((jsonArray) => {
        let style_id = 0;
        const allSkus = {};
        let skus = [];
        jsonArray.forEach((skuObj, index) => {
          const sku_id = Number(skuObj.id);
          const quantity = Number(skuObj.quantity)
          const { size } = skuObj;
          const sku_info = { quantity, size };
          const sku_object = { sku_id, sku_info };
          if (Number(skuObj.styleId) !== style_id) {
            style_id = Number(skuObj.styleId);
            skus = [sku_object];
            allSkus[style_id] = skus;
          } else {
            skus.push(sku_object);
          }
        });
        // transform styles data and add photos and skus as sub documents
        csv()
          .fromFile(csvFilePathStyles)
          .then((jsonArray) => {
            const batchedAllStyles = [];
            let allStyles = [];
            let product_id = 0;
            let results;
            jsonArray.forEach((styleObj, index) => {
              if (allStyles.length === 100000) {
                batchedAllStyles.push(allStyles);
                allStyles = [];
              }
              style_id = Number(styleObj.id);
              const name = styleObj.name;
              const original_price = Number(styleObj.original_price);
              const sale_price = styleObj.sale_price === 'null' ? 0 : Number(styleObj.sale_price);
              const default_style = Number(styleObj.default_style) ? true : false;
              photos = allPhotos[style_id] || [];
              skus = allSkus[style_id] || [];
              const styleInfo = { style_id, name, original_price, sale_price, 'default?': default_style, photos, skus };
              if (Number(styleObj.productId) !== product_id) {
                product_id = Number(styleObj.productId);
                results = [styleInfo]
                allStyles.push({product_id, results})
              } else {
                results.push(styleInfo);
              }
            });
            if (allStyles.length > 0) {
              batchedAllStyles.push(allStyles);
            }
            batchedAllStyles.forEach((allStyles, index) => {
              const jsonFilePathStyle = path.join(__dirname, 'transformed', `style-mini${index + 1}.json`);
              jsonfile.writeFile(jsonFilePathStyle, allStyles)
                .then(console.log('File created: ', jsonFilePathStyle));
            });
          });
      });
  });
