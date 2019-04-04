const mysql = require('mysql');

const conn = mysql.createConnection({
    multipleStatements: true,
    host: '139.196.138.71',
    user: 'root',
    password: 'yubinzhao@123',
    database: 'demo'
})

conn.connect();
module.exports = conn;