import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Chat from './pages/Chat';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Login from './pages/Login';
import UserList from './pages/UserList';
import Signup from './pages/Singup';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Start" element={<Start />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Main" element={<Main />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="*" element={<h1>404 - 페이지를 찾을 수 없습니다.</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
