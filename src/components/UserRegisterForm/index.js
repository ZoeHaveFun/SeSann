import { useRef } from 'react';
import styled from 'styled-components/macro';
import { PropTypes } from 'prop-types';
import { firebaseUsers } from '../../utils/firestore';

const Wrapper = styled.div`
  padding-top: 100px;
  background-color: #ffbf69;
  height: 100vh;
`;

function UserRegisterForm({ JoinFormRef }) {
  const registerName = useRef();
  const registerEmail = useRef();
  const registerPassword = useRef();

  const postRegister = () => {
    firebaseUsers.register(
      registerName.current.value,
      registerEmail.current.value,
      registerPassword.current.value,
    );

    registerName.current.value = '';
    registerEmail.current.value = '';
    registerPassword.current.value = '';
  };
  return (
    <Wrapper ref={JoinFormRef}>
      <h2>會員註冊</h2>
      <label htmlFor="registerName">
        名稱
        <input type="text" name="registerName" placeholder="怎麼稱呼你呢" ref={registerName} />
      </label>
      <label htmlFor="registerEmail">
        Email
        <input type="email" name="registerEmail" placeholder="輸入email" ref={registerEmail} />
      </label>
      <label htmlFor="registerPassword">
        密碼
        <input type="password" name="registerPassword" placeholder="輸入密碼" ref={registerPassword} />
      </label>
      <button type="button" onClick={postRegister}>註冊</button>
    </Wrapper>
  );
}

export default UserRegisterForm;

UserRegisterForm.propTypes = {
  JoinFormRef: PropTypes.func.isRequired,
};
