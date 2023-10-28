var ruta=require("express").Router();
const conexion = require("../bd/conexion");
var subirArchivos=require("../middlewares/middlewaresProducto").subirArchivos;
var eliminarArchivoProd=require("../middlewares/middlewaresProducto").eliminarArchivoProd;
var { mostrarProducto, nuevoProducto, buscarProductoPorID, modificarProducto, borrarProducto } = require("../bd/productoBD");
const Producto = require("../modelos/producto");

ruta.get("/producto",async(req, res)=>{
    var productos = await mostrarProducto()
    console.log(productos);
    res.render("producto/mostrarProducto",{productos});
});

ruta.get("/nuevoproducto",(req, res)=>{
    res.render("producto/producto");
});
ruta.post("/nuevoproducto",subirArchivos(), async (req, res) => {
    console.log(req.file.originalname);
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/");
});

ruta.get("/editarProducto/:id", async (req, res) => {
    console.log(req.params.id);
    var producto = await buscarProductoPorID(req.params.id);
    res.render("producto/modificarProducto", { producto });
    res.end();
});

ruta.post("/editarProducto",subirArchivos(), async (req, res) => {
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await modificarProducto(req.body);
    res.redirect("/producto");
});

ruta.get("/borrarProducto/:id", async (req, res) => {
    try {
        var producto = await buscarProductoPorID(req.params.id);
        if (!producto) {
          res.status(200).send("producto no encontrado.");
        } else {
          var archivo = producto.foto;
          await borrarProducto(req.params.id);
          eliminarArchivoProd(archivo)(req, res, () => {
            res.redirect("/");
          });
        }
      } catch (err) {
        console.log("Error al borrar producto" + err);
        res.status(400).send("Error al borrar producto.");
      }
});

module.exports=ruta;