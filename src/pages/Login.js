import { useRef, useState } from 'react';
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
  /* background-color: ; */
  padding: 30px 10px 30px 40px;
`;
const RightForm = styled.div`
  margin-left: 8px;
  border-left: 0.1px #0e6ba8 solid;
  padding: 30px 40px 30px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > h2 {
    text-align: center;
    letter-spacing: 0.2rem;
    font-weight: 500;
    color: #001c55;
  }
  & > label {
    padding: 10px 0px;
  }
  & > button {
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
`;

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const loginEmail = useRef();
  const loginPassword = useRef();
  const navegate = useNavigate();

  const postLogin = async () => {
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
    } else {
      setErrorMessage(result);
    }
  };
  return (
    <Wrapper>
      <LoginWrapper>
        <LeftBanner>
          <Link to="/">
            <Logo>
              <img alt="logo" src={logo} />
              SéSann 泤衫
            </Logo>
          </Link>
          <p>
            你的洗衣好幫手
            <br />
            省時 方便 快速
          </p>
        </LeftBanner>
        <RightForm>
          <h2>會員登入</h2>
          <label htmlFor="loginEmail">
            Email
            <br />
            <input type="email" name="loginEmail" placeholder="輸入email" ref={loginEmail} />
          </label>
          <label htmlFor="loginPassword">
            密碼
            <br />
            <input type="password" name="loginPassword" placeholder="輸入密碼" ref={loginPassword} />
          </label>
          <button type="button" onClick={postLogin}>登入</button>
          {
            errorMessage ? <p>{errorMessage}</p> : ''
          }
        </RightForm>

      </LoginWrapper>
    </Wrapper>
  );
}

export default Login;
