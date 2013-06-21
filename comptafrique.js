/*

Compta Node.js - Compta en ligne
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
/**
 * Module for starting a standalone server
 */
var bootweb = require("bootweb");
bootweb.init(__dirname, function(app, cb){
  var compta = require('./app'),
    config = {
      "prefix": "/"
    };
  bootweb.appsRegistry.loadApp("compta",compta,config);
    cb();
});

// TODO: if main
// console.log('comptafrique is a bootweb application - see how to embed apso in your bootweb app ==> http://xxx/');

