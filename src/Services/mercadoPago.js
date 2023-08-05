const mercadopago = require('mercadopago');
const express = require('express');
const router = express.Router()

mercadopago.configure({
  access_token: 'APP_USR-426931006695176-061519-6eb17b170e45868a2732d843be8a1205-132670730',

});
const mercadoPago = async (req,res)=>{
  const prod = req.body
 let preference = {
  items: [{
    id:123,
    title: prod.title,
    currency_id:'ARS',
    picture_url:prod.imagen,
    description:prod.description,
    category_id:"art",
    quantity: 1,
    unit_price: prod.price
  }],
  back_urls: {
           success:"http://localhost3000/success" ,
        failure:"" ,
         pending: ""
        },
       auto_return: "approved",
    binary_mode: true,
       };
       mercadopago.preferences.create(preference).then((response)=>
       res.status(200).send({response})).catch((error)=>
         res.status(400).send({error:error.message})) 
 
}

module.exports = mercadoPago