import dayjs from 'dayjs';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { MonetizationOn, AccessTime } from '@styled-icons/material-rounded';
import { firebaseUsers, firebaseReserve, firebaseMachines } from '../utils/firestore';
import DefaultstoreMainImg from '../style/imgs/storeMainImg.jpg';
import Loading from '../components/Loading';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const RemindWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 4px 1px #DDE1E4;
  &+&{
    margin-bottom: 10px;
  }
`;
const StorePart = styled.div`
  width: 160px;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  &:hover {
    >div{
      background-color: #327CA7;
      color: #DDE1E4;
    }
  }
  &>div{
    display: flex;
    align-items:center;
    padding: 10px;
    border: 1px #DDE1E4 solid;
    border-radius: 0.8rem;
    transition: all .3s;
  }
  &>span {
    margin-left: 16px;
    font-size: 14px;
    color: #8B8C89;
  }
`;
const StoreImg = styled.img`
  width: 60px;
  border-radius: 50%;
  margin-right: 8px;
`;
const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 0px 20px;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  &>h3 {
    color: #E7ECEF;
  }
`;
const Left = styled.div`
  flex: 1;
  &>h3 {
    color: #DDE1E4;
    font-weight: 500;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 20px;
  border-left: 1px #DDE1E4 solid;
  border-right: 1px #DDE1E4 solid;
  span {
    font-size: 20px;
    padding-top: 5px;
  }
`;
const ReserveDetail = styled.div`
  display: flex;
  flex-direction: column;
  &>div{
    span {
      margin-right: 10px;
    }
  }
  svg {
    width: 16px;
    color: #8B8C89;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const Button = styled.button`
  padding: 8px 10px;
  background-color: ${(props) => (props.cancel ? '' : '#a5be00')};
  color: ${(props) => (props.cancel ? '#8B8C89' : '#FEFCFB')};
  box-shadow: 0px 0px 4px #8B8C89;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  border-radius: 0.8rem;
  &:hover {
    background-color: ${(props) => (props.cancel ? '#B64A41' : '#327CA7')};
    color: #FEFCFB;
  }
`;

function RemindCard({ remind, CancelReserve }) {
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
    <RemindWrapper>
      <Link to={`/store?store_id=${remind.store_id}?machine_id=${remind.machine_id}`}>
        <StorePart>
          <div>
            <StoreImg src={DefaultstoreMainImg} />
            <span>{remind.store_name}</span>
          </div>
          <span>{`${dayjs(remind.reserve_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
        </StorePart>
      </Link>
      <Container>
        <Left>
          <h3>IT&apos;S YOUR TURN!  你的預約項目:</h3>
          <ReserveDetail>
            <div>
              <span>
                <AccessTime />
                {remind.category.time}
              </span>
              <span>
                <MonetizationOn />
                {remind.category.price}
              </span>
            </div>
            <span>{remind.category.name}</span>
            <span>{remind.machine_name}</span>

          </ReserveDetail>
        </Left>
        <Right>
          預約保留時間
          <span>
            { countDown ? <span>{`${countDown} m`}</span>
              : <Loading />}
          </span>
        </Right>
      </Container>
      <ButtonWrapper>
        <Link to={`/store?store_id=${remind.store_id}?machine_id=${remind.machine_id}`}>
          <Button>
            前往啟動
          </Button>
        </Link>
        <Button cancel onClick={() => CancelReserve(remind.machine_id, remind.reserve_id)}>
          取消預約
        </Button>
      </ButtonWrapper>
    </RemindWrapper>
  );
}

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
  CancelReserve: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;
function InformationPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const [reminds, setReminds] = useState([]);

  const CancelReserve = async (machineId, reserveId) => {
    const reserveMachineData = await firebaseMachines.getOne(machineId);
    const newReserveIds = reserveMachineData.reserveIds.filter((id) => id !== reserveId);
    const newRemids = reminds.filter((item) => item.reserve_id !== reserveId);

    firebaseMachines.updateReserveIds(machineId, newReserveIds);
    firebaseReserve.delet(reserveId);
    setReminds(newRemids);
  };
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
    <Wrapper>
      {
        reminds?.map?.((remind) => (
          <RemindCard
            remind={remind}
            key={remind.reserve_id}
            CancelReserve={CancelReserve}
          />
        ))
      }
    </Wrapper>
  );
}

export default InformationPage;
