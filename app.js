/*

comptafrique - Comptabilité simplifiée bootweb
Copyright (C) $year Nicolas Karageuzian

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

*/
var bootweb = require('bootweb'),
  conn,
  logger = bootweb.getLogger('bootweb-store'), //facilité de logs
  _ = require("util"),
  EventEmitter = require('events').EventEmitter,
  /**
   * Définition de l'application compta
   */
  comptApp = new EventEmitter(); // notre appli est capable d'emettre des evenements
  

/**
 * Pour que Bootweb démarre notre appli, nous devons faire une function d'initialisation
 */
comptApp.init = function(options, cb) { // Bootweb apelle en premier l'init de l'appli
  logger.info("Starting compta initialization");
  if (cb == null && typeof options === "function") { //si appel sans callback
    cb = options;
    options = { // options par défaut
      "prefix": "/compta/"  
    };
  }
  if (options === undefined) { // options par défaut
    options = {
      "prefix": "/compta/"  
    };
  }
  if (typeof options.prefix === "undefined") { // le prefix est obligatoire
    options.prefix = "/compta/"; 
  }
  logger.info("Ajout des templates de l'appli : " + __dirname + "/templates");
  bootweb.templatesDirs.push(__dirname + "/templates");
  this.options = options;
  cb(null, comptApp); // appel du callback
}

/**
 * Trigger sur l'event ready de bootweb 
 */
bootweb.on("ready", function(){ // Une fois que bootweb est 'ready' (connecté à la DBB, écoute sur les ports)
   // on rajoute nos ressources statiques (mount sur /)
  bootweb.addStaticDir(__dirname + "/static");
  conn = bootweb.getConnection();
  // on fera l'initialisation des objets et du modèle ici
  
  /**
   * Initializing io events and interactions (see socket.io documentation)
   * (controlleur socket)
   */
  bootweb.io.on("connection", function(socket) {
   // handle socket messages for authenticated users
    if (socket.handshake.user != null && socket.handshake.user.email !== "anonymous") {
      logger.info("Socket established for user " + socket.handshake.user + ", binding compta");
      
    }
  });
  comptApp.emit("ready"); // L'appli se déclare "ready" 
});

/**
 * Mapping des URL de l'application (controlleur HTTP)
 * Voir la doc expressjs pour app.get/app.post/app.put, etc...
 */
comptApp.mapUrls = function(app, cb){
  //require("./lib/model");
  this.app = app;
  app.get(comptApp.options.prefix, function(req, res, next) {
    res.send(bootweb.swig.compileFile("index.html")
        .render({
          // values required for layout
          prefix : comptApp.options.prefix,
          user: req.user
          // other values
        }));
  });
}

module.exports = comptApp;