

export const domain = window.location.href.includes('localhost') ?  'http://localhost:5000' : `https://${window.location.host}`

console.log(`v4 | DOMAIN :: ${domain}`)






