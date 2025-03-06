import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { withCredentials: true });

const Chat = () => {
    const { roomid: paramRoomId } = useParams();
    const location = useLocation();
    const user = location.state?.user || { userid: 'guest' };
    const receiver = location.state?.receiver || { nickname: '알 수 없음' };
    const roomid = paramRoomId || location.state?.roomid;

    console.log('📢 최종 채팅방 roomid:', roomid);
    console.log('📢 현재 로그인한 유저 정보:', user);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!user || !roomid) {
            console.error('❌ Error: user 또는 roomid 정보가 없습니다.');
            return;
        }

        // ✅ 기존 소켓 리스너 제거 후 다시 등록
        socket.off('joinRoom');
        socket.emit('joinRoom', roomid);
        console.log(`✅ 채팅방 입장: ${roomid}`);

        fetch(`http://localhost:5000/api/chat/history/${roomid}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('📢 채팅 내역 불러오기 응답:', data);
                if (data.success) {
                    setMessages(data.messages);
                }
            })
            .catch((err) => console.error('채팅 내역 불러오기 오류:', err));

        socket.off('receiveMessage');
        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('joinRoom'); // ✅ 나갈 때 이벤트 리스너 정리
        };
    }, [roomid, user]);

    const handleSendMessage = () => {
        if (!user || !roomid) {
            console.error('❌ Error: user 또는 roomid 정보가 없습니다.');
            return;
        }

        if (input.trim() === '') return;

        const messageData = {
            roomid,
            sender: user.userid,
            message: input,
        };

        socket.emit('sendMessage', messageData);

        // ✅ 메시지를 직접 setMessages로 추가하지 않고, 서버에서 받은 메시지만 추가
        setInput('');
    };

    return (
        <div>
            <h2>상대방 : {receiver.nickname}</h2>
            <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{msg.sender}</strong>: {msg.message}{' '}
                        <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSendMessage}>전송</button>
                <Link to={'/Main'} id="Main">
                    <button>채팅방 나가기</button>
                </Link>
            </div>
        </div>
    );
};

export default Chat;
