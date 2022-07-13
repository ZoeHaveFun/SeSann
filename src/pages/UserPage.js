import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import {
  SettingsPower, CalendarToday, Inventory, ModeEdit, Check, MonetizationOn, Message,
} from '@styled-icons/material-rounded';
import { HeartCircle } from '@styled-icons/boxicons-solid';
import { firebaseUsers } from '../utils/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import user1 from '../style/imgs/userImgs/1.png';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  height: 100vh;
  padding: 80px 0px 0px;
  position: relative;
  margin-bottom: 50px;
`;
const TitleWrpper = styled.div`
  position: absolute;
  width: 100%;
  color: #FEFCFB;
  padding: 40px 0px 160px;
  border-radius: 0 0 40% 60%;
  background-image: linear-gradient(to bottom, #327CA7, #FEFCFB);
`;
const Title = styled.div`
  width: 80%;
  max-width: 1120px;
  margin: auto;
  padding-left: 8px;
  font-size: 16px;
  letter-spacing: 0.1rem;
  font-family: 'Noto Sans TC', sans-serif;
`;
const Container = styled.div`
  width: 80%;
  max-width: 1120px;
  margin: 70px auto;
  display: flex;
  flex-direction: column;
`;
const UserHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  background-color: #EFF0F2;
  border-radius: 0.8rem;
  margin-bottom: 20px;
  box-shadow: 0px 0px 8px #8B8C89;
`;
const Left = styled.div`
  flex: 2;
  display: flex;
  border-right: 1px #DDE1E4 solid;
  margin-right: 16px;
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  &>span {
    margin-top: 8px;
    display: flex;
    font-size: 24px;
    >svg {
      width: 30px;
      margin-right: 4px;
    }
  }
`;
const UserInfo = styled.div`
  width: 100%;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans TC', sans-serif;
  input {
    font-size: 18px;
    padding: 4px 8px 2px;
    margin-bottom: 2px;
    border-radius: 0.4rem 0.4rem 0 0;
    border: transparent;
    font-family: 'Noto Sans TC', sans-serif;
    color: #1C5174;
    box-shadow: ${(props) => (props.isEdit ? '0px 1px #8B8C89' : '')};
    background-color: ${(props) => (props.isEdit ? '#FEFCFB' : 'transparent')};
    transition: all .3s;
  }
  &>span:nth-child(2) {
    color: #8B8C89;
    font-size: 12px;
    padding-left: 8px;
  }
`;
const EditBtn = styled.button`
  position: absolute;
  right: 16px;
  bottom: -2px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => (props.isEdit ? '#a5be00' : '#DDE1E4')};
  cursor: pointer;
  transition: all .3s;
  &:hover {
    box-shadow: 0px 0px 4px #666;
    color: #1C5174;
    >svg { 
      color: #1C5174;
    }
  }
  >svg { 
    width: 20px;
    color: #FEFCFB;
  }
`;
const UserImg = styled.img`
  width: 100px;
  border-radius: 50%;
  margin-right: 14px;
  box-shadow: 0px 0px 2px #999;
`;
const MainContain = styled.div`
  width: 100%;
`;
const TabBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  font-family: 'Noto Sans TC', sans-serif;
`;
const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 4px 2px;
  text-align: center;
  color:  ${(props) => (props.isSelect ? '#1C5174' : '#8B8C89')};
  box-shadow: ${(props) => (props.isSelect ? '0px 2px #1C5174' : '')};
  text-decoration: none;
  transition: all .3s;
  &+& {
    margin-left: 26px;
  }
`;
const Icon = styled.span`
  display: flex;
  margin-right: 2px;
  &>svg{
    width: ${(props) => (props.bigger ? '30px' : '20px')};
  }
`;

function UserPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const pathArray = useLocation().pathname.split('/');
  const currentTag = pathArray[pathArray.length - 1];
  const [edit, setEdit] = useState(false);
  const [userData, setUserData] = useState({});

  const updateUserInfo = () => {
    if (!edit) {
      setEdit(!edit);
      return;
    }
    firebaseUsers.updateData(userData.user_id, userData);
    setEdit(!edit);
  };
  const changeUserInfo = (e) => {
    const newData = { ...userData };
    newData.user_name = e.target.value;
    setUserData(newData);
  };
  useEffect(() => {
    setUserData(userInfo);
  }, [userInfo]);
  return (
    <>
      <Header />
      <Wrapper>
        <TitleWrpper>
          <Title>
            我的帳戶
          </Title>
        </TitleWrpper>
        <Container>
          <UserHeader>
            <Left>
              <UserImg src={user1} />
              <UserInfo isEdit={edit}>
                <label htmlFor="userName">
                  <input
                    type="text"
                    name="userName"
                    value={userData.user_name}
                    disabled={!edit}
                    onChange={(e) => { changeUserInfo(e); }}
                  />
                </label>
                <span>{`ID: ${userInfo.user_id}`}</span>
                <EditBtn isEdit={edit} type="button" onClick={() => { updateUserInfo(); }}>
                  {
                  edit ? <Check /> : <ModeEdit />
                }
                </EditBtn>

              </UserInfo>
            </Left>
            <Right>
              我的點數:
              <span>
                <MonetizationOn />
                {userInfo.points}
              </span>
            </Right>

          </UserHeader>
          <MainContain>
            <TabBar>
              <Button to="/user/processing" isSelect={currentTag === 'processing'}>
                <Icon>
                  <SettingsPower />
                </Icon>
                進行中
              </Button>
              <Button to="/user/reserve" isSelect={currentTag === 'reserve'}>
                <Icon>
                  <CalendarToday />
                </Icon>
                預約中
              </Button>
              <Button to="/user" isSelect={currentTag === 'user'}>
                <Icon bigger>
                  <Message />
                </Icon>
              </Button>
              <Button to="/user/orders" isSelect={currentTag === 'orders'}>
                <Icon>
                  <Inventory />
                </Icon>
                全部訂單
              </Button>
              <Button to="/user/collect" isSelect={currentTag === 'collect'}>
                <Icon>
                  <HeartCircle />
                </Icon>
                收藏店家
              </Button>
            </TabBar>
            <Outlet />
          </MainContain>
        </Container>
      </Wrapper>
      <Footer />
    </>
  );
}

export default UserPage;
