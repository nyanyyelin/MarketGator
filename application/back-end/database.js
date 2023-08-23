const mysql = require('mysql2');

const db = mysql.createPool({
host: '34.211.120.29',
//host: 'localhost:3006',
user: 'csc648',
database: 'csc648db',
password: 'password1!',
multipleStatements: true,
connectTimeout: 10000,
});

module.exports = db.promise();