require('dotenv').config();
const path = require('path');
const express = require('express');

// const routeCache = require('route-cache');
const apicache = require('apicache');

const db = require('../database/database.js');

const app = express();

// middleware
app.use(express.json());
app.use(apicache.middleware('30 seconds'));

// routes/controllers

// List Products
app.get('/products', (req, res) => {
  const count = Number(req.query.count) || 5;
  const page = Number(req.query.page) || 1;
  const startProduct = count * (page - 1) + 1;
  const endProduct = count * page;
  db.Product.find({product_id: {$gte: startProduct, $lte: endProduct}}, '-_id -features._id')
    .lean()
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.get('/products/:product_id', (req, res) => {
  const product_id = req.params.product_id;
  db.Product.findOne({ product_id }, '-_id -features._id')
    .lean()
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

//, routeCache.cacheSeconds(30)

// Without aggregation
app.get('/products/:product_id/styles', (req, res) => {
  const product_id = req.params.product_id;
  db.AllStyle.findOne({ product_id }, '-_id -results._id -results.photos._id -results.skus._id')
    .lean()
    .then((data) => {
      if (data === null) {
        res.status(200).json({product_id, results: []});
      } else {
        for (const result of data.results) {
          let skus = {};
          result.skus.forEach((skuObj) => {
            skus[skuObj.sku_id] = skuObj.sku_info;
          });
          result.skus = skus;
        };
        res.status(200).json(data);
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

// exploring aggregation - will come back to it
// app.get('/products/:product_id/styles', (req, res) => {
//   const product_id = req.params.product_id;
//   db.AllStyle.findOne({product_id, $expr: {$map: {
//     input: results,
//     as: result,
//     in: {

//     }
//   }}}, '-_id -results._id -results.photos._id -results.skus._id')
//     .lean()
//     .then((data) => {
//       if (data === null) {
//         res.status(200).json({product_id, results: []});
//       } else {
//         res.status(200).json(data);
//       }
//     }).catch((err) => {
//       console.log(err);
//       res.status(500).send(err);
//     });
// });

app.get('/products/:product_id/related', (req, res) => {
  const product_id = req.params.product_id;
  db.AllRelatedProduct.findOne({ product_id }, '-_id')
    .lean()
    .then((data) => {
      const output = data.related_products.map((related_product) => (related_product.related_product_id));
      res.status(200).json(output);
    }).catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});



// listen
app.listen(process.env.PORT, () => {console.log('Server listening on port ', process.env.PORT)});