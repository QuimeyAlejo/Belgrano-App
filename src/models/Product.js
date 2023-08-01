const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false
      },
       Model: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      product: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
      },
      price:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
      descripcion:{
        type: DataTypes.STRING,

      },
     createdInDb: {
       type: DataTypes.BOOLEAN,
       defaultValue: true,
       allowNull: false,
      },
  });
    
  }