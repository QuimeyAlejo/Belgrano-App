const mercadopago = require('mercadopago');
const express = require('express');
const router = express.Router()

mercadopago.configure({
    access_token: 'APP_USR-426931006695176-061519-6eb17b170e45868a2732d843be8a1205-132670730',
  
});

// router.post('/', ( req,res)=>{
//   const items = req.body.map((item) => {
//     return {
//       title: item.name,
//       unit_price: item.price,
//       quantity: item.quantity,
//       description: item.stars.toString(),
//       service: item.name,
//       id: item.id,
//       currency_id: 'ARS',
//       picture_url: item.image // Asigna la URL de la imagen del producto
//     };
//   });
  
//   const preference = {
//     items: items,
//     back_urls: {
//       success:"https://www.youtube.com/watch?v=dQw4w9WgXcQ" ,
//       failure:"https://twitter.com/fefe_22/status/1192449165516775424/photo/1" ,
//       pending: "https://twitter.com/fefe_22/status/1192449165516775424/photo/1"
//     },
//     auto_return: "approved",
//     binary_mode: true,
//   };
//   mercadopago.preferences.create(preference).then((response)=>
//     res.status(200).send({response})).catch((error)=>
//      res.status(400).send({error:error.message})) 
// })
router.post('', (req,res) => {
  // res.status(200).send("funciona")
  const products = req.body

  const chequeoInv = products.map(prods => { return { ...prods, inventario: prods.inventario - prods.qty } });

  const articulos = chequeoInv.map(prods => { return { id: prods._id, picture_url: prods.imagenes[0], category_id: "fashion", title: prods.modelo, unit_price: prods.precio, description: prods.descripcion, quantity: prods.qty, currency_id: "ARS" } });

  
  // console.log("ESTO TIENE ARTICULOS ", articulos);
  
  const preference = {
    items: articulos,
    back_urls: {
      success: "http://localhost:3000/compraexitosa",
      failure: "",
      pending: "",
    },
    auto_return: "approved",
    binary_mode: true,
  };
 
  
  mercadopago.preferences.create(preference).then((response)=>
  res.status(200).send({response})).catch((error)=>
   res.status(400).send({error:error.message})) 
})
module.exports = router