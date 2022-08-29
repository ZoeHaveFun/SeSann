import { useRef } from 'react';
import styled from 'styled-components/macro';
import { firebaseUsers } from '../../utils/firestore';
import { Toast } from '../Alert';

const Wrapper = styled.div`
  margin: auto;
  padding-top: 100px;
  height: 50vh;
`;
const RegisterForm = styled.div`
  width: 600px;
  margin-left: calc(10vw);
  position: relative;
  background-color: #1C5174;
  box-shadow: 0px 0px 8px 2px #8B8C89;
  display: flex;
  padding: 20px 30px;
  border-radius: 0.8rem;
  flex-direction: column;
  &>div:nth-child(2){
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    label {
      color: #DDE1E4;
      font-family: 'Noto Sans TC', sans-serif;
      width: 280px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      input {
        margin-left: 16px;
        flex: 1;
        padding: 4px 6px;
        border-radius: 0.2rem;
        border: transparent;
        border-bottom: 1px #DDE1E4 solid;
      }
    }
  }
`;
const Button = styled.button`
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px 16px;
  border: 1px #DDE1E4 solid;
  border-radius: 0.8rem;
  color: #1C5174;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  background-color: #FEFCFB;
  color: #1C5174;
  &:hover{
    background-color: #023047;
    color: #FEFCFB;
    box-shadow: 0px 0px 4px #bbbec0;
  }
`;
const TitleDiv = styled.div`
  width: 80%;
  display: flex;
  font-family: 'Noto Sans TC', sans-serif;
  color: #FFB703;
  margin-bottom: 16px;
  & >h2 {
    font-size: 32px;
    font-weight: 500;
    margin-right: 10px;
    letter-spacing: 0.2rem;
  }
`;
const SecTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  span:nth-child(2) {
    display: inline-block;
    background-color: #DDE1E4;
    padding: 1px 8px;
    margin-top: 2px;
    width: 60px;
  }
`;
function UserRegisterForm() {
  const registerName = useRef(null);
  const registerEmail = useRef(null);
  const registerPassword = useRef(null);

  const postRegister = async () => {
    if (registerName.current.value === null) {
      Toast.fire({
        icon: 'error',
        title: '請輸入名稱',
      });
      return;
    }
    if (registerEmail.current.value === null || registerPassword.current.value === null) {
      Toast.fire({
        icon: 'error',
        title: '帳號密碼不能為空',
      });
      return;
    }
    const result = await firebaseUsers.register(
      registerName.current.value,
      registerEmail.current.value,
      registerPassword.current.value,
    );
    if (result === 'success') {
      registerName.current.value = '';
      registerEmail.current.value = '';
      registerPassword.current.value = '';
      Toast.fire({
        icon: 'success',
        title: '註冊成功',
      });
    } else if (result === 'auth/email-already-in-use') {
      Toast.fire({
        icon: 'error',
        title: 'email已被註冊',
      });
    } else if (result === 'auth/weak-password') {
      Toast.fire({
        icon: 'error',
        title: '密碼須超過6碼',
      });
    } else if (result === 'auth/invalid-email') {
      Toast.fire({
        icon: 'error',
        title: 'email地址無效',
      });
    } else {
      Toast.fire({
        icon: 'error',
        title: result,
      });
    }
  };
  return (
    <Wrapper>
      <RegisterForm>
        <TitleDiv>
          <h2>會員註冊</h2>
          <SecTitle>
            <span>馬上實現時間自由</span>
            <span />
          </SecTitle>
        </TitleDiv>
        <div>
          <form>
            <label htmlFor="registerName">
              名稱:
              <input type="text" name="registerName" placeholder="怎麼稱呼你呢" ref={registerName} />
            </label>
            <label htmlFor="registerEmail">
              Email:
              <input type="email" name="registerEmail" placeholder="輸入email" ref={registerEmail} />
            </label>
            <label htmlFor="registerPassword">
              密碼:
              <input type="password" name="registerPassword" autoComplete="off" placeholder="輸入密碼" ref={registerPassword} />
            </label>
          </form>
        </div>
        <Button type="button" onClick={postRegister}>加入</Button>
      </RegisterForm>
    </Wrapper>
  );
}

export default UserRegisterForm;
