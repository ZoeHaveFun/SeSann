import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { firebaseUsers } from '../utils/firestore';
import logo from '../style/imgs/raccoon.svg';
import laundryday from '../style/imgs/laundryday.jpg';
import { Toast } from '../components/Alert';

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 34px;
  color: #034078;
  & > img {
    width: 46px;
    margin-right: 20px;
  }
`;
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url(${laundryday});
  background-position: left bottom;
  background-size: 50%;
  background-repeat: no-repeat;
`;
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  opacity: 0.9;
  box-shadow: 0px 0px 4px #001c55;
  padding: 20px;
  border-radius: 0.8rem;
  font-family: 'Noto Sans TC', sans-serif;
`;
const LeftBanner = styled.div`
  padding: 30px 20px;
`;
const RightForm = styled.div`
  margin-left: 8px;
  border-left: 0.1px #0e6ba8 solid;
  padding: 30px 40px 30px 30px;
  & > h2 {
    text-align: center;
    letter-spacing: 0.2rem;
    font-weight: 500;
    color: #001c55;
  }
  & > form {
    label {
      color: #001c55;
      font-family: 'Noto Sans TC', sans-serif;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      font-size: 16px;
      span {
        padding: 4px 6px;
      }
      input {
        font-size: 16px;
        background-color: none;
        padding: 4px 6px;
        border-radius: 0.2rem;
        border: transparent;
        border-bottom: 1px #DDE1E4 solid;
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
          -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
          -webkit-transition-delay: 9999s;
        }
      }
    }
  }
  button {
      width: 100%;
      background-color: #001c55;
      padding: 4px 0px;
      border-radius: 0.8rem;
      color: #ffffff;
      font-family: 'Noto Sans TC', sans-serif;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
      &:hover {
        background-color: #ff9f1c;
      }
    }
  p {
    margin-top: 8px;
    font-size: 14px;
    text-align: end;
    > a {
      color: #0e6ba8;
      &:hover {
        color: #ff9f1c;
      }
    }
  }
`;

function Login() {
  const loginEmail = useRef('');
  const loginPassword = useRef('');
  const navegate = useNavigate();

  const postLogin = async () => {
    if (loginEmail.current.value === '' || loginPassword.current.value === '') {
      Toast.fire({
        icon: 'error',
        title: '帳號密碼不能為空',
      });
      return;
    }
    const result = await firebaseUsers.signIn(
      loginEmail.current.value,
      loginPassword.current.value,
    );

    if (result.user) {
      Toast.fire({
        icon: 'success',
        title: '您已登入',
      });
      navegate('/', { replace: true });
      loginEmail.current.value = '';
      loginPassword.current.value = '';
    } else if (result === 'auth/wrong-password') {
      Toast.fire({
        icon: 'error',
        title: '密碼輸入錯誤',
      });
    } else if (result === 'auth/user-not-found') {
      Toast.fire({
        icon: 'error',
        title: '找不到使用者',
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: result,
      });
    }
  };
  return (
    <Wrapper onKeyUp={(e) => { if (e.key === 'Enter') { postLogin(); } }}>
      <LoginWrapper>
        <LeftBanner>
          <Link to="/">
            <Logo>
              <img alt="logo" src={logo} />
              SéSann
            </Logo>
          </Link>
          <p>
            你的洗衣好幫手
            <br />
            省時 方便 快速
          </p>
        </LeftBanner>
        <RightForm>
          <h2>登入</h2>
          <form>
            <label htmlFor="loginEmail">
              <span>Email</span>
              <input type="email" name="loginEmail" placeholder="輸入email" ref={loginEmail} />
            </label>
            <label htmlFor="loginPassword">
              <span>密碼</span>
              <input type="password" autoComplete="off" name="loginPassword" placeholder="輸入密碼" ref={loginPassword} />
            </label>
          </form>
          <button type="button" onClick={postLogin}>登入</button>
          <p>
            還沒有註冊嗎?
            <Link to="/?to=join">我要註冊</Link>
          </p>
        </RightForm>

      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
