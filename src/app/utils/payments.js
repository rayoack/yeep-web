export const junoUrlBaseAuthorization = process.env.NODE_ENV === 'development' ?
    'https://sandbox.boletobancario.com' :
    'https://api.juno.com.br'

export const junoUrlBase = process.env.NODE_ENV === 'development' ?
    'https://sandbox.boletobancario.com/api-integration' :
    'https://api.juno.com.br'