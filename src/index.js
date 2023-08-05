require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const uploadImage = require("./Services/uploadImage.js");
const app = express();
const port = process.env.PORT || 3525;
const cors = require("cors");
const {
  getAllProductsFromAPI,
  getProductByID,
  getAllProductsOrByBrand,
  getAllProductsOrByQuery,
  createProduct,
  getAllProductsFromDB,
  getAllProducts,
} = require("../src/controller/product");
const {
  getProductForTipo,
  getProductsForPrice,
} = require("../src/Routes/filters.js");
const { conn } = require("./db");
const mp = require ('../src/Services/mercadoPago.js')
const mercadopago = require("mercadopago");

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  // Reemplaza con tu origen frontend|| 'https://belgranoinformatica.vercel.app/'
};

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.get("/", function (req, res) {
  res.status(200).send({
    message: "Servidor corriendo running server",
  });
});

app.post('/payment',mp)
app.get("/products", getAllProductsOrByQuery);
app.get("/products/brand", getAllProductsOrByBrand);
app.get("/products/:tipo", getProductForTipo);
app.get("/products/filter", getProductsForPrice);
app.get("/products/id/:id", getProductByID);
app.post("/products", createProduct);

//-----------------------------------------------------------------------------------

// mercadopago.configure({
//   access_token:
//     "APP_USR-426931006695176-061519-6eb17b170e45868a2732d843be8a1205-132670730",
// });

// app.post("/payment", (req, res) => {
//   // res.status(200).send('funciona')
//   const prod = req.body;
//   let preference = {
//     items: [
//       {
//         id: 123,
//         title: prod.title,
//         currency_id: "ARS",
//         picture_url: prod.image,
//         description: prod.description,
//         category_id: "art",
//         quantity: 1,
//         unit_price: 1,
//       },
      
//     ],
//     back_urls: {
//       success: "http://localhost:3000", // Cambia la URL a la correcta
//       failure: "",
//       pending: "",
//     },
//     auto_return: "approved", // Corrige el nombre
//     binary_mode: true,
//   };

//   mercadopago.preferences
//     .create(preference)
//     .then((response) => res.status(200).send({ response }))
//     .catch((error) => res.status(400).send({ error: error.message }));
// });


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
