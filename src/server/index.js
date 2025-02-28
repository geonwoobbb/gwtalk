const express = require('express');
const cors = require('cors');
const db = require('../database/db.js'); // MySQL 연결 설정 불러오기

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
); // CORS 해결
app.use(express.json());

// 유저 리스트 불러오기 API
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리 오류:', err); // 오류 로그 추가
            res.status(500).json({ error: '서버 에러', details: err.message });
        } else {
            console.log('유저 데이터:', results);
            res.json(results);
        }
    });
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
