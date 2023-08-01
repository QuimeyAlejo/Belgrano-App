require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const uploadImage = require('./Services/uploadImage.js');
const app = express();
const port = process.env.PORT || 3525;
const cors = require('cors');
const { getAllProductsFromAPI, getProductByID, getAllProductsOrByQuery, createProduct,getAllProductsFromDB,getAllProducts } = require('../src/controller/product');
const {getProductForTipo,getProductsForPrice} = require ('../src/Routes/filters.js')
const { conn } = require('./db');
const mercadoPago = require('../src/Services/mercadoPago.js')





const corsOptions = {
  origin: 'http://127.0.0.1:5173' // Reemplaza con tu origen frontend
};
// Convierte una petición recibida (POST-GET...) a objeto JSON
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors(corsOptions));
app.use('/payment',mercadoPago)
app.get('/', function (req, res) {
  res.status(200).send({
    message: 'Servidor corriendo'
  });
});

app.get('/products', getAllProductsOrByQuery);
app.get('/products/:tipo', getProductForTipo);
app.get('/products/filter', getProductsForPrice);
app.get('/products/id/:id', getProductByID);
app.post('/products', createProduct);

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

app.post("/uploadMultipleImages", (req, res) => {
  uploadImage
    .uploadMultipleImages(req.body.images)
    .then((urls) => res.send(urls))
    .catch((err) => res.status(500).send(err));
});

conn.sync({ force: true }).then(async () => {
  // await getAllProductsFromAPI();
  await getAllProducts();
  
  app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port);
  });
});
