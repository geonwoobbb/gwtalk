import '../css/main.css';
import '../css/font.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Main = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // 1️⃣ 현재 로그인한 사용자 정보 가져오기
        axios
            .get('/api/session')
            .then((response) => {
                if (response.data.loggedIn) {
                    setCurrentUser(response.data.user); // 세션 정보 저장
                }
            })
            .catch((error) => {
                console.error('세션 정보 가져오기 실패:', error);
            });

        // 2️⃣ 유저 리스트 가져오기
        axios
            .get('/api/users')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('유저 리스트 불러오기 실패:', error);
            });
    }, []);

    return (
        <div className="container">
            <h2>대화 가능 유저</h2>

            <ul className="user-list">
                {users
                    .filter((user) => user.userid !== currentUser?.userid)
                    .map((user, index) => (
                        <li key={index} className="user-item">
                            <span>{user.nickname}</span>
                            <button onClick={() => alert(`${user.nickname}님과 대화를 시작합니다.`)}>대화 시작</button>
                        </li>
                    ))}
            </ul>
            <Link to={'/Login'}>
                <button className="button1">로그인 화면으로 돌아가기</button>
            </Link>
        </div>
    );
};

export default Main;
