const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('Medilaser2026*', 10);
console.log('Hash para Medilaser2026*:', hash);
