const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rjsdn123!',
    database: 'gwtalkid',
});

db.connect((err) => {
    if (err) {
        console.error('mysql 연결 실패:', err);
        return;
    }
    console.log('mysql 연결 성공');
});

module.exports = db;
