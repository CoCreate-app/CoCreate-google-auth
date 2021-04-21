(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function(CoCreateGoogleAuth) {
        	return factory(CoCreateGoogleAuth)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateGoogleAuth = require("./server.js")
      module.exports = factory(CoCreateGoogleAuth);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateGoogleAuth) {
  return CoCreateGoogleAuth;
}));