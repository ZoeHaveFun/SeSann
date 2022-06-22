import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components/macro';
import { firebaseUsers } from '../firestore';

const Wrapper = styled.div`
  display: flex;
  height: 50vh;
`;
const UserInfo = styled.div`
  width: 200px;
  text-align: center;
  padding: 50px 20px;
  background-color: #EFF0F2;
`;
const TabWrapper = styled.div`
  width: 100%;
  border: 1px #9A9A9A solid;
  padding: 0px 30px;
`;
const TabBar = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const Button = styled(Link)`
  flex: 1;
  padding: 10px 0px;
  text-align: center;
  border: 1px #484848 solid;
  background-color: #EFF0F2;
`;

function UserPage() {
  const userId = 'mVJla3AyVysvFzWzUSG5';
  const [userInfo, setUserInfo] = useState({});
  const [userOders, setUserOders] = useState({});

  const { CreateContext } = firebaseUsers;
  useEffect(() => {
    firebaseUsers.get(userId)
      .then((res) => {
        setUserInfo(res);
        setUserOders(res.orders);
      });
  }, [userId]);

  return (
    <>
      <Link to="/">回到首頁</Link>
      <h1>個人頁</h1>
      <Wrapper>
        <UserInfo>
          <h2>{userInfo.user_name}</h2>
          <h4>
            {`我的點數 ${userInfo.points}`}
          </h4>
        </UserInfo>
        <TabWrapper>
          <TabBar>
            <Button to="/user/processing">進行中</Button>
            <Button to="/user/reserve">預約中</Button>
            <Button to="/user/orders">全部訂單</Button>
          </TabBar>
          <CreateContext.Provider value={userOders}>
            <Outlet />
          </CreateContext.Provider>
        </TabWrapper>
      </Wrapper>
    </>
  );
}

export default UserPage;
