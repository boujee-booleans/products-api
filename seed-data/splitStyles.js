const fs = require('fs/promises');
const path = require('path');

const csvFilePathStyles = path.join(__dirname, 'raw', 'styles.csv');

const csvBatchPath = path.join(__dirname, 'raw-batches/');

const maxProducts = 100000;

fs.readFile(csvFilePathStyles, 'utf8')
  .then((data) => {
    const rows = data.split('\n');
    let product_id = 0;
    let headerRow = rows[0];
    const batchedSplitData = [];
    let splitData = [];
    curr_prod_data = '';
    for (let i = 1; i < rows.length; i++) {
      const product_id_start = rows[i].indexOf(',') + 1;
      const product_id_end = rows[i].indexOf(',', product_id_start);
      const curr_product_id = Number(rows[i].slice(product_id_start, product_id_end));

      if (curr_product_id !== product_id) {
        product_id = curr_product_id;
        splitData.push(curr_prod_data);
        curr_prod_data = rows[i];
        if (splitData.length === 100000) {
          const nextStyle_id = rows[i].slice(0, rows[i].indexOf(','));
          batchedSplitData.push(headerRow + splitData.join('\n'));
          console.log('File ', batchedSplitData.length, ' next style_id is: ', nextStyle_id);
          splitData = [];
        }
      } else {
        curr_prod_data += '\n' + rows[i];
      }
    }
    splitData.push(curr_prod_data);
    const finalStyle_id = splitData[splitData.length - 1].slice(0, splitData[splitData.length - 1].indexOf(','));
    batchedSplitData.push(headerRow + splitData.join('\n'));
    console.log('File ', batchedSplitData.length, ' final style_id is: ', finalStyle_id);
    batchedSplitData.forEach((splitData, index) => {
      const csvBatchFilePath = `${csvBatchPath}styles${index + 1}.csv`;
      fs.writeFile(csvBatchFilePath, splitData)
        .then(() => {
          console.log('File created: ', csvBatchFilePath)
        });
    });
  })