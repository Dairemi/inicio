var admin = require("firebase-admin");
var keys = require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db = admin.firestore();

var conexionUsuarios = db.collection("usuarios");
var conexionProductos = db.collection("productos");

module.exports = {
    conexionUsuarios,
    conexionProductos
};
