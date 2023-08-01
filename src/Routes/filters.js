const express = require('express');
// const Product = require('./models/Product');
const {getAllProducts} = require('../controller/product')


const getProductForTipo = async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const allProducts = await getAllProducts(); // Reemplaza esto con la función para obtener todos los productos desde la base de datos
    

    // Aplicar el filtro basado en el tipo de producto
    const tipoFilter = tipo === 'All'
      ? allProducts
      : allProducts.filter(e => e.tipo === tipo);

    // Enviar la respuesta con los productos filtrados
    res.json(tipoFilter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const getProductsForPrice = async (req, res) => {
  try {
    const productos = await getAllProducts();
    console.log(productos.map(e=> e.precio)+ 'que trae') 
    const sortedPrice = productos.sort((a, b) => a.precio - b.precio);

    res.json(sortedPrice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos por precio' });
  }
};

 

module.exports = { getProductForTipo,getProductsForPrice };
