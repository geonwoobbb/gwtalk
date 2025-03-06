const express = require('express');
const cors = require('cors');
const db = require('../database/db.js');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: 'http://localhost:3000', credentials: true },
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(
    session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// 🟢 WebSocket 연결
io.on('connection', (socket) => {
    console.log(`✅ 새로운 클라이언트 접속: ${socket.id}`);

    socket.on('joinRoom', (roomid) => {
        // ✅ 중복 입장 방지: 이미 들어간 방이면 다시 입장하지 않음
        if (socket.rooms.has(roomid)) {
            console.log(`🚨 이미 채팅방 ${roomid}에 입장한 소켓 (${socket.id})`);
            return;
        }

        socket.join(roomid);
        console.log(`✅ 클라이언트 ${socket.id}가 채팅방 ${roomid}에 입장`);
    });

    socket.on('sendMessage', async ({ roomid, sender, message }) => {
        if (!roomid || !sender) {
            console.error('❌ Error: roomid 또는 sender가 없습니다.');
            return;
        }

        try {
            await db
                .promise()
                .query('INSERT INTO messages(room_id, sender, message) VALUES (?, ?, ?)', [roomid, sender, message]);
            console.log('📢 메시지가 DB에 저장됨');

            io.to(roomid).emit('receiveMessage', { sender, message, timestamp: new Date() });
        } catch (err) {
            console.error('❌ 메시지 저장 오류:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔴 클라이언트 연결 해제: ${socket.id}`);
    });
});

// 유저리스트
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.promise().query('SELECT * FROM user');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: '서버 에러', details: err.message });
    }
});

// 로그인

app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;
    try {
        const [results] = await db.promise().query('SELECT * FROM user WHERE LOWER(userid) = LOWER(?)', [userid]);
        if (results.length === 0 || results[0].password !== password) {
            return res.json({ success: false, message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }
        req.session.user = { userid };
        req.session.save(() => {
            res.json({ success: true, message: '로그인 성공!', user: req.session.user });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

app.post('/api/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 오류: ', err);
            return res.status(500).json({ success: false, message: '로그아웃 실패' });
        }

        res.clearCookie('connect.sid');
        return res.json({ success: true, message: '로그아웃 완료' });
    });
});
// 회원가입
app.post('/api/signup', async (req, res) => {
    const { userid, password, nickname } = req.body;
    console.log('회원가입 요청 데이터:', req.body);
    try {
        const [idcheck] = await db.promise().query('SELECT * FROM user WHERE LOWER(userid) = LOWER(?)', [userid]);
        if (idcheck.length !== 0) {
            return res.json({ success: false, message: '이미 사용중인 아이디입니다!' });
        }

        const [nickcheck] = await db.promise().query('SELECT * FROM user WHERE LOWER(nickname) = LOWER(?)', [nickname]);

        if (nickcheck.length !== 0) {
            return res.json({ success: false, message: '이미 사용중인 닉네임입니다!' });
        }

        await db
            .promise()
            .query('INSERT INTO user (userid, password, nickname) VALUES (?,?,?)', [userid, password, nickname]);
        return res.json({ success: true, message: '회원가입 성공! ' });
    } catch (err) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

//세션
app.get('/api/session', (req, res) => {
    res.json({ loggedIn: !!req.session.user, user: req.session.user || null });
});

// 채팅방생성
app.post('/api/chat/create', async (req, res) => {
    let { user1, user2 } = req.body;

    console.log(`📢 채팅방 생성 요청 - user1: ${user1}, user2: ${user2}`);

    // ✅ user1과 user2를 항상 같은 순서로 정렬
    if (user1 > user2) {
        [user1, user2] = [user2, user1];
    }

    try {
        // ✅ 기존 채팅방 확인 (정렬된 user1, user2 기준으로 검색)
        const [existingRoom] = await db
            .promise()
            .query('SELECT id FROM chat_room WHERE user1 = ? AND user2 = ?', [user1, user2]);

        if (existingRoom.length > 0) {
            console.log(`✅ 기존 채팅방 존재 - roomid: ${existingRoom[0].id}`);
            return res.json({ success: true, roomid: existingRoom[0].id });
        }

        // ✅ 기존 채팅방이 없으면 새로 생성
        const [newRoom] = await db
            .promise()
            .query('INSERT INTO chat_room (user1, user2) VALUES (?, ?)', [user1, user2]);

        console.log(`✅ 새 채팅방 생성 - roomid: ${newRoom.insertId}`);
        return res.json({ success: true, roomid: newRoom.insertId });
    } catch (err) {
        console.error('❌ 채팅방 생성 오류:', err);
        return res.status(500).json({ success: false, message: '서버 오류' });
    }
});

//채팅방 저장
app.get('/api/chat/history/:roomid', async (req, res) => {
    const { roomid } = req.params;
    try {
        const [messages] = await db
            .promise()
            .query('SELECT sender, message, timestamp FROM messages WHERE room_id = ? ORDER BY timestamp ASC', [
                roomid,
            ]);
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

app.get('/api');

server.listen(5000, () => console.log('🚀 서버 실행 중 (포트: 5000)'));
