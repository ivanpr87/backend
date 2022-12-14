//Servidor************
const express = require('express');
const { Router } = express;
const aplicacion = express();

const rutaProductos = Router();

const port = 8080;

//***** Hacemos la carpeta public visible
aplicacion.use('/static', express.static(__dirname + '/public'));
//****************

aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

class Contenedor {
  constructor(productos) {
    this.productos = productos;
  }

  save(objeto) {
    let id = 1;
    this.productos.forEach((element, index) => {
      if (element.id >= id) {
        id = element.id + 1;
      }
    });
    objeto.id = id;
    this.productos.push(objeto);
    return id;
  }

  getById(id) {
    let objetoSeleccionado = null;
    this.productos.forEach(element => {
      if (element.id == id) {
        objetoSeleccionado = element;
      }
    });
    return objetoSeleccionado;
  }

  getAll() {
    return this.productos;
  }

  deleteById(id) {
    let indexSeleccionado = -1;
    this.productos.forEach((element, index) => {
      if (element.id == id) {
        indexSeleccionado = index;
      }
    });
    if (indexSeleccionado != -1) {
      this.productos.splice(indexSeleccionado, 1);
    }
    
  }

  deleteAll() {
    this.productos = [];
  }

  update(producto) {
    let objetoSeleccionado = null;
    this.productos.forEach((element, indice) => {
        if (element.id == producto.id) {
          objetoSeleccionado = indice;
        }
        if (objetoSeleccionado){
          this.productos[objetoSeleccionado] = producto;
        }

    });
}
}
const productos = new Contenedor([]);

//Datos de prueba
productos.save({
  title: 'PC',
  price: '4000',
  thumbnail: 'image1'
});

productos.save({
  title: 'Teclado',
  price: '400',
  thumbnail: 'image2'
});



//Endpoints***

//Get by id
 
rutaProductos.get('/:id', (peticion, respuesta) => {
  const id = parseInt(peticion.params.id);
  const producto = productos.getById(id);
  if (producto) {
    respuesta.json(producto);
  } else {
    respuesta.status(404);
    respuesta.json({ error : 'producto no encontrado' });
  }
  
});

rutaProductos.get('/', (peticion, respuesta) => {
  const listaProductos = productos.getAll();
  respuesta.json(listaProductos);
});

rutaProductos.post('/', (peticion, respuesta) => {
    const producto = peticion.body;
    if(producto) {
      let title = (producto.hasOwnProperty('title'))? true:false;
      let price = (producto.hasOwnProperty('price'))? true:false;
      let thumbnail = (producto.hasOwnProperty('thumbnail'))? true:false;
      console.log('El producto tiene titulo?:' + title);
      console.log('El producto tiene price?:' + price);
      console.log('El producto tiene thumbnail?:' + thumbnail);

      if(title == false || price == false || thumbnail == false){
        console.log('error');
       
      }
      else{
        productos.save(producto)
      }
    }

   //productos.save(producto)
    respuesta.send("ok");
});


rutaProductos.put('/:id', (peticion, respuesta) => {
  const producto = peticion.body  
  const id = peticion.params.id;
  productos.update({id, ...producto});
  respuesta.json({
    status: "ok"
  });
});

rutaProductos.delete('/:id', (peticion, respuesta) => {
    
    const id = parseInt(peticion.params.id);
    const producto = productos.getById(id);
    if (producto) {
      productos.deleteById(id);
      respuesta.status(204).end();
    } else {
      !producto && respuesta.status(404).json(notFound);
    }

});

aplicacion.use('/api/productos', rutaProductos);

//***********


//Servidor************
const servidor = aplicacion.listen(port, () => {
  console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on('error', error => console.log(`Error: ${error}`));
//****************