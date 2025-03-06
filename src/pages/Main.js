import '../css/main.css';
import '../css/font.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import e from 'cors';

const Main = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('/api/session', { withCredentials: true })
            .then((response) => {
                if (response.data.loggedIn) {
                    setCurrentUser(response.data.user);
                }
            })
            .catch((error) => console.error('세션 정보 가져오기 실패:', error));

        axios
            .get('/api/users')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('유저 리스트 불러오기 실패:', error));
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/logout', {}, { withCredentials: true });

            if (response.data.success) {
                alert('로그아웃 성공!');
                navigate('/login');
            } else {
                alert('로그아웃 실패 : ' + response.data.message);
            }
        } catch (error) {
            alert('서버 오류로 로그아웃에 실패하였슴다.');
        }
    };

    const startChat = async (user) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.post(
                '/api/chat/create',
                { user1: currentUser.userid, user2: user.userid },
                { withCredentials: true }
            );

            if (response.data.success) {
                const roomid = response.data.roomid;
                console.log(`✅ 채팅방 이동 - roomid: ${user}`);

                // ✅ 같은 roomid를 모든 유저가 공유하도록 설정
                navigate(`/chat/${roomid}`, { state: { user: currentUser, roomid, receiver: user } });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('❌ 채팅방 생성 오류:', error);
        }
    };

    return (
        <div>
            <h2>유저 목록</h2>
            <ul>
                {users
                    .filter((user) => user.userid !== currentUser?.userid)
                    .map((user) => (
                        <li key={user.userid}>
                            <span>{user.nickname}</span>
                            <button onClick={() => startChat(user)}>대화 시작</button>
                        </li>
                    ))}
            </ul>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default Main;
