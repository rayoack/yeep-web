"use strict";Object.defineProperty(exports, "__esModule", {value: true}); const junoUrlBaseAuthorization = process.env.NODE_ENV === 'development' ?
    'https://sandbox.boletobancario.com' :
    'https://api.juno.com.br'; exports.junoUrlBaseAuthorization = junoUrlBaseAuthorization

 const junoUrlBase = process.env.NODE_ENV === 'development' ?
    'https://sandbox.boletobancario.com/api-integration' :
    'https://api.juno.com.br'; exports.junoUrlBase = junoUrlBase