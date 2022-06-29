import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firebaseUsers } from '../utils/firestore';

function Login() {
  const loginEmail = useRef();
  const loginPassword = useRef();
  const navegate = useNavigate();

  const postLogin = async () => {
    firebaseUsers.signIn(
      loginEmail.current.value,
      loginPassword.current.value,
    );
    navegate('/', { replace: true });
    loginEmail.current.value = '';
    loginPassword.current.value = '';
  };
  return (
    <div>
      <Link to="/">回到首頁</Link>
      <h2>會員登入</h2>
      <label htmlFor="loginEmail">
        Email
        <input type="email" name="loginEmail" placeholder="輸入email" ref={loginEmail} />
      </label>
      <label htmlFor="loginPassword">
        密碼
        <input type="password" name="loginPassword" placeholder="輸入密碼" ref={loginPassword} />
      </label>
      <button type="button" onClick={postLogin}>登入</button>
    </div>
  );
}

export default Login;
