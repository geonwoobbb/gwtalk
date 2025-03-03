const express = require('express');
const cors = require('cors');
const db = require('../database/db.js'); // MySQL 연결 설정 불러오기
const session = require('express-session');

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
    session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
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
app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        const [results] = await db.promise().query('SELECT * FROM user WHERE LOWER(userid) = LOWER(?);', [userid]);
        if (results.length === 0) {
            return res.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }

        const dbpassword = results[0].password;

        //  비밀번호가 일치하는지 확인
        if (dbpassword === password) {
            // 세션에 유저 정보 저장
            req.session.user = { userid };

            console.log('로그인 성공 - 세션 저장됨:', req.session.user);

            req.session.save(() => {
                res.json({ success: true, message: '로그인 성공!', user: req.session.user });
            });
        } else {
            return res.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }
    } catch (err) {
        console.error('로그인 오류:', err);
        return res.status(500).json({ success: false, message: '서버 오류' });
    }
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

app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
