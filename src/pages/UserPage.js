import { useEffect, useState, useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import { firebaseUsers, firebaseReserve } from '../utils/firestore';
import Header from '../components/Header';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 80px;
`;
const Title = styled.h1`
  color: #001c55;
  margin: 30px 10px 20px 10px;
  border-bottom: 1px #001c55 solid;
`;
const UserInfoWrapper = styled.div`
  display: flex;
  height: 50vh;
  margin-top: 50px;
`;
const UserInfo = styled.div`
  width: 300px;
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

const RemindWrapper = styled.div`
  background-color: #FFFFFF;
  padding: 16px 0px 36px;
  border-radius: 0.5rem;
  position: relative;
  & > button {
    cursor: pointer;
    background-color: #EFF0F2;
    position: absolute;
    border-color: #484848;
    right: 14px;
    bottom: 10px;
  }
`;

function RemindCard({ remind }) {
  const [countDown, setCountDown] = useState();

  useEffect(() => {
    const handleCountDown = setInterval(() => {
      const timeLeft = dayjs.duration(
        dayjs(dayjs(remind.estimate_startTime.seconds * 1000)).diff(dayjs()),
      ).$d;
      if (timeLeft.minutes < 1 && timeLeft.seconds < 1) {
        clearInterval(handleCountDown);
      } else {
        setCountDown(`${timeLeft.minutes} : ${timeLeft.seconds}`);
      }
    }, 1000);
  });

  return (
    <RemindWrapper key={remind.reserve_id}>
      <div>{`${remind.store_name} ${remind.category.name}${remind.category.time}分鐘`}</div>
      <div>
        預約保留時間
        <span>{countDown}</span>
      </div>
      <button type="button">
        <Link to={`/store?store_id=${remind.store_id}`}>
          ➜
        </Link>
      </button>
    </RemindWrapper>
  );
}

function UserPage() {
  const [reminds, setReminds] = useState([]);
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;

  useEffect(() => {
    firebaseReserve.getQuery(userId, 'user_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => {
        const remindlists = data.filter((list) => {
          const timeLeft = dayjs.duration(
            dayjs(dayjs(list.estimate_startTime.seconds * 1000)).diff(dayjs()),
          ).$d.minutes;
          return timeLeft >= 1 && timeLeft <= 5;
        });
        setReminds(remindlists);
      });
  }, [userId]);

  return (
    <>
      <Header />
      <Wrapper>
        <Title>我的帳戶</Title>
        <UserInfoWrapper>
          <UserInfo>
            <h2>{userInfo.user_name}</h2>
            <h4>
              {`我的點數 ${userInfo.points}`}
            </h4>
            {
            reminds?.map?.((remind) => <RemindCard remind={remind} key={remind.reserve_id} />)
          }
          </UserInfo>
          <TabWrapper>
            <TabBar>
              <Button to="/user/processing">進行中</Button>
              <Button to="/user/reserve">預約中</Button>
              <Button to="/user/orders">全部訂單</Button>
              <Button to="/user/collect">收藏店家</Button>
            </TabBar>
            <Outlet />
          </TabWrapper>
        </UserInfoWrapper>
      </Wrapper>

    </>
  );
}

export default UserPage;

RemindCard.propTypes = {
  remind: PropTypes.shape({
    reserve_id: PropTypes.string,
    machine_id: PropTypes.string.isRequired,
    machine_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    store_name: PropTypes.string.isRequired,
    reserve_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    estimate_startTime: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
