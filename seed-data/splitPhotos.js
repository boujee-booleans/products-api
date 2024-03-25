const fs = require('fs/promises');
const path = require('path');

const csvFilePathStyles = path.join(__dirname, 'raw', 'photos.csv');

const csvBatchPath = path.join(__dirname, 'raw-batches/');

const styleLimits = [245021, 489000, 733439, 977197, 1222226, 1467658, 1712625, 1956949, 10000000];

fs.readFile(csvFilePathStyles, 'utf8')
  .then((data) => {
    console.log('Got here');
    const rows = data.split('\n');
    console.log('Got here???');
    let style_id = 0;
    let headerRow = rows[0];
    const batchedSplitData = [];
    let splitData = [];
    curr_style_data = '';
    let styleLimitIndex = 0;
    let styleLimit = styleLimits[0];
    for (let i = 1; i < rows.length; i++) {
      const style_id_start = rows[i].indexOf(',') + 1;
      const style_id_end = rows[i].indexOf(',', style_id_start);
      const curr_style_id = Number(rows[i].slice(style_id_start, style_id_end));

      if (curr_style_id !== style_id) {
        style_id = curr_style_id;
        splitData.push(curr_style_data);
        curr_style_data = rows[i];
        if (splitData.length >= styleLimit) {
          styleLimitIndex ++;
          styleLimit = styleLimits[styleLimitIndex];
          const nextStyle_id = rows[i].slice(0, rows[i].indexOf(','));
          batchedSplitData.push(headerRow + splitData.join('\n'));
          splitData = [];
        }
      } else {
        curr_style_data += '\n' + rows[i];
      }
    }
    splitData.push(curr_style_data);
    const finalStyle_id = splitData[splitData.length - 1].slice(0, splitData[splitData.length - 1].indexOf(','));
    batchedSplitData.push(headerRow + splitData.join('\n'));
    batchedSplitData.forEach((splitData, index) => {
      const csvBatchFilePath = `${csvBatchPath}photos${index + 1}.csv`;
      fs.writeFile(csvBatchFilePath, splitData)
        .then(() => {
          console.log('File created: ', csvBatchFilePath)
        });
    });
  })