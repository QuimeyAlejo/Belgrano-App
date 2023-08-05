// const axios = require("axios")
// const { Product, Brands, HardType} = require ('../db.js')
// const { Op } = require("sequelize");
// const e = require("express");

// const ProductController = {}
// esta funcion trae la info de la api
// async function getAllProducts(req, res) {
//   const name = req?.query.name;
//   if (name) return res.json(await getProductByName(name));
//   try {
//     const listProduct = await Product.findAll();
//     res.send(listProduct)

//     // si no hay hardware en la base de datos se procede a crearlos
//     if (!listProduct.length) {
//       const brandsHard = [];
     
//       const products = await axios.get(
//         `https://belgranoapiproducts-964d4-default-rtdb.firebaseio.com/.json`
//       );
//       let initialData = products.data?.map((e) => ({
//       brand:e.brand,
//       modelo:e.Model,
//       descripcion:e.descripcion,
//         imagen:e.imagen,
//         precio:e.precio,
//         tipo:e.Product
//       }));

//       initialData.map(
//         (e) => !brandsHard.includes(e.brand) && brandsHard.push(e.brand)
//       );

      

//       // Procede a crear las marcas en la base de datos
//       brandsHard.sort().map(async (brand) => {
//         await Brands.findOrCreate({ where: { name: brand } });
//       });

      

//       // se actualizan la lista de celulares para incluir las relaciones de marca y sistema operativo
//       initialData.map(async (el) => {
//         // const findIdOs = await Os.findOne({ where: { name: el.SO.trim() } });

//         const findIdBrand = await Brands.findOne({ where: { name: el.brand } });

      
//           findIdBrand &&
//           (await Product.update(
//             {  brandId: findIdBrand.id },
//             { where: { name: el.name } }
//           ));
//       });

//       const productCreate = await Product.findAll({
//         include: [{ model: Brands}],
//       });
//       await creatDatosPrueba();
//       return res?.json(
//         productCreate.length > 0
//           ? productCreate.sort((a, b) => a.id - b.id)
//           : "No se pudo el hardware"
//       );
//     } else {
//       return res?.json(listProduct.sort((a, b) => a.id - b.id));
//     }
//   } catch (error) {
//     return error;
//   }
// }


// const getAllProducts2 = async ()=>{
//   const apiU = await axios.get('https://belgranoapiproducts-964d4-default-rtdb.firebaseio.com/.json')
//   const apiU2 = await axios.get(apiU.data.next)
//   const allProduct = apiU.data.results.concat(apiU2.data.results)
//   const finalInfo = await Promise.all(
//       allProduct.map(async e =>{
//           const product = await axios.get(e.url) 
//           return{
             
//               image: product.data.image,
//               brand:product.data.brand,
//               modelo:product.data.Model,
//               descripcion:product.data.descripcion,
//               imagen:product.data.imagen,
//               precio:product.data.precio,
//               tipo:product.data.Product
             
//           }
//       })
//   )
//   console.log(finalInfo, "que trae")
//   return finalInfo;
// }


// const getDbInfo = async () =>{
//   return await Product.findAll({
//       include:{
//           model: Brands,
//           attributes: ['name'],
//           through:{
//               attributes: [],
//           },
//       }
//   })
// }


// const getProducts = async () => {
//   const apiInfo = await getApiInfoProduct();
//   const dbInfo = await getDbInfo();
//   const infoTotal = apiInfo.concat(dbInfo);
//   return infoTotal;
// }


// const getallProductOrByQuery = async (req, res)=>{
//   const name = req.query.name;
//   const allProduct = await getProducts();
//   if(name){
//       const productName = await allProduct.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
//       productName.length ? res.status(200).send(productName) : res.status(404).send('Product not found');
//   }else{
//       res.status(200).send(allProduct)
//   }
// }


// const getProductByID = async (req, res)=>{
//   const {id} = req.params;
//   const productsId = await getProducts();
//   let productsFilter = productsId.filter(e => e.id == id)
//   if(productsFilter.length > 0){
//       return res.status(200).send(productsFilter)
//   }else{
//       res.status(404).send('Id not found')
//   }
// }



// module.exports = {getAllProducts, getallProductOrByQuery,getProductByID,getAllProducts2}
 
 const express = require("express");
const axios = require("axios");
const { Product, Brands } = require('../db.js');
const { Op } = require("sequelize");


// Función para obtener todos los productos de la API
const getAllProductsFromAPI = async(res,)  => {
  try {
    const response = await axios.get('https://belgranoapiproducts-964d4-default-rtdb.firebaseio.com/.json');
    // console.log("que trae",response)
    const products = response.data.map(e => ({
      id:e.id,
      brand: e.brand,
      modelo: e.Model,
      descripcion: e.descripcion,
      imagen: e.image,
      precio: e.price,
      tipo: e.product
    }));
    // console.log(products, 'trae')
    return products;
  } catch (error) {
    throw error;
  }

}



// Función para obtener todos los productos de la base de datos
const getAllProductsFromDB = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Brands }]
    });

    // Aquí puedes procesar los datos de la base de datos según tus necesidades
    // y devolver la información deseada.

    return products;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los productos (API + base de datos)
const getAllProducts = async () => {
  try {
    const apiProducts = await getAllProductsFromAPI();
    const dbProducts = await getAllProductsFromDB();

    // Combinar los productos de la API y la base de datos según tus necesidades.
    const allProducts = [...apiProducts, ...dbProducts];

    return allProducts;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los productos o filtrar por nombre
const getAllProductsOrByQuery = async (req, res) => {
  
    try {
      const name = req.query.name;
      const allProducts = await getAllProducts();
      
      if (name) {
        const filteredProducts = allProducts.filter(product => product.modelo.includes(name)) ;
  
        if (filteredProducts.length > 0) {
          return res.status(200).json(filteredProducts);
        } else {
          return res.status(404).json({ message: 'Product not found model' });
        }
      } else {
        return res.status(200).json(allProducts);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

  const getAllProductsOrByBrand = async (req, res) => {
    try {
      const name = req.query.name;
      const allProducts = await getAllProducts();
      
      if (name) {
        const filteredProducts = allProducts.filter(product =>
          (product.brand && product.brand.includes(name))
        );
  
        if (filteredProducts.length > 0) {
          return res.status(200).json(filteredProducts);
        } else {
          return res.status(404).json({ message: 'Product not found brand' });
        }
      } else {
        return res.status(200).json(allProducts);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  

// Función para obtener un producto por ID
const getProductByID = async (req, res) => {
  try {
    const { id } = req.params;
    const allProducts = await getAllProducts();

    const product = allProducts.find(product => product.id == id);

    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const createProduct = async (req, res) => {
  try {
    // Obtener los datos del producto del cuerpo de la solicitud
    const { brand, modelo, descripcion, imagen, precio, tipo } = req.body;

    // Crear el objeto de producto
    const productObj = {
      brand,
      modelo,
      descripcion,
      imagen,
      precio,
      tipo
    };

    // Guardar el producto en la base de datos o hacer cualquier otra operación necesaria
    // ...

    // Enviar una respuesta de éxito
    res.status(200).json({ message: 'Producto creado con éxito' });
  } catch (error) {
    // En caso de producirse un error, enviar una respuesta de error
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};



module.exports = {getAllProductsFromAPI,
  getAllProductsFromDB,
  getAllProducts,
  getAllProductsOrByQuery,
  getProductByID,
  createProduct,
  getAllProductsOrByBrand};


