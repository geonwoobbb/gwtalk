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

// 로그인 인증 API
app.post('/api/login', (req, res) => {
    const { userid, password } = req.body;
    //유저 db에 존재하는지 확인
    const sql = 'SELECT * FROM user WHERE LOWER(userid) = LOWER(?); ';
    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error('쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }
        // db에 해당 username이 없을때
        if (results.length === 0) {
            return res.json({ success: false, message: '아이디 또는 비번이 틀렸습니다.' });
        }
        const dbpassword = results[0].password;

        if (dbpassword === password) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: '아이디 또는 비번이 틀렸습니다.' });
        }
    });
});

// 회원가입 API
app.post('/api/signup', async (req, res) => {
    console.log('받은 데이터:', req.body);
    const { userid, password, nickname } = req.body;

    try {
        // 아이디 중복 확인
        const [userCheck] = await db.promise().query('SELECT * FROM user WHERE LOWER(userid) = LOWER(?);', [userid]);
        if (userCheck.length !== 0) {
            return res.json({ success: false, message: '해당 아이디는 사용중입니다.' });
        }

        // 닉네임 중복 확인
        const [nickCheck] = await db
            .promise()
            .query('SELECT * FROM user WHERE LOWER(nickname) = LOWER(?);', [nickname]);
        if (nickCheck.length !== 0) {
            return res.json({ success: false, message: '해당 닉네임은 사용중입니다.' });
        }

        // 회원가입 데이터 삽입 (위 조건 통과 시 실행)
        await db
            .promise()
            .query('INSERT INTO user (userid, password, nickname) VALUES (?, ?, ?);', [userid, password, nickname]);

        return res.json({ success: true, message: '회원가입 성공!' });
    } catch (err) {
        console.error('회원가입 오류:', err);
        return res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
