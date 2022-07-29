import dayjs from 'dayjs';
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { MonetizationOn, AccessTime } from '@styled-icons/material-rounded';
import Swal from 'sweetalert2';
import { firebaseUsers, firebaseReserve, firebaseMachines } from '../utils/firestore';
import DefaultstoreMainImg from '../style/imgs/storeMainImg.jpg';
import Loading from '../components/Loading';
import { archiveReserve } from '../utils/reuseFunc';

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
  justify-content: ${(props) => (props.isRecord ? 'flex-end' : 'space-around')} ;
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
        archiveReserve([remind]);
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

const RecordWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 4px 1px #DDE1E4;
  border: ${(props) => (props.isExpiredReserve ? '2px #b64a41 solid' : '2px #a5be00 solid')};
  &+&{
    margin-bottom: 10px;
  }
`;
const Titile = styled.h3`
  color: #DDE1E4;
  font-weight: 500;
  > span {
    margin-right: 8px;
    color: ${(props) => (props.isExpiredReserve ? '#b64a41' : '#a5be00')};
  }
`;
const IknowButton = styled.button`
  padding: 4px 12px;
  background-color: #E7ECEF;
  color: #8B8C89;
  box-shadow: 0px 0px 4px #8B8C89;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  border-radius: 0.8rem;
  &:hover {
    background-color: #8B8C89;
    color: #E7ECEF;
  }
`;
function RecordCard({ record, deletRecord }) {
  return (
    <RecordWrapper isExpiredReserve={record.reserve_id}>
      <Link to={`/store?store_id=${record.store_id}?machine_id=${record.machine_id}`}>
        <StorePart>
          <div>
            <StoreImg src={DefaultstoreMainImg} />
            <span>{record.store_name}</span>
          </div>
          <span>
            {
              record.reserve_time
                ? `${dayjs(record.estimate_startTime.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`
                : `${dayjs(record.start_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`
            }
          </span>
        </StorePart>
      </Link>
      <Container>
        <Left>
          {record.process_id
            ? (
              <Titile>
                <span>IT&apos;S DONE!</span>
                你的洗滌項目:
              </Titile>
            )
            : (
              <Titile isExpiredReserve>
                <span>IT&apos;S CANCELED!</span>
                你的預約項目已逾期:
              </Titile>
            )}
          <ReserveDetail>
            <div>
              <span>
                <AccessTime />
                {record.category.time}
              </span>
              <span>
                <MonetizationOn />
                {record.category.price}
              </span>
            </div>
            <span>{record.category.name}</span>
            <span>{record.machine_name}</span>
          </ReserveDetail>
        </Left>
      </Container>
      <ButtonWrapper isRecord>
        <IknowButton onClick={() => { deletRecord(record.process_id || record.reserve_id); }}>
          我知道了
        </IknowButton>
      </ButtonWrapper>
    </RecordWrapper>
  );
}
RecordCard.propTypes = {
  record: PropTypes.shape({
    reserve_id: PropTypes.string,
    process_id: PropTypes.string,
    machine_id: PropTypes.string.isRequired,
    machine_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    store_name: PropTypes.string.isRequired,
    reserve_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }),
    estimate_startTime: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }),
    start_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }),
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  deletRecord: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;
const Message = styled.h3`
  width: 100%;
  box-shadow: 0px 0px 8px #e7ecef;
  border-radius: 0.8rem;
  padding: 20px 0px;
  color: #bec5c9;
  text-align: center;
  font-size: 18px;
`;
function InformationPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const [reminds, setReminds] = useState([]);
  const [records, setRecords] = useState([]);

  const CancelReserve = async (machineId, reserveId) => {
    Swal.fire({
      title: '確定要取消預約嗎?',
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        popup: 'secondReserve',
      },
      cancelButtonText: '我再想想',
      confirmButtonText: '是的,我要取消',
      confirmButtonColor: '#b64a41',
    }).then(async (result) => {
      if (result.isConfirmed === false) return;
      const reserveMachineData = await firebaseMachines.getOne(machineId);
      const newReserveIds = reserveMachineData.reserveIds.filter((id) => id !== reserveId);
      const newRemids = reminds.filter((item) => item.reserve_id !== reserveId);

      firebaseMachines.updateReserveIds(machineId, newReserveIds);
      firebaseReserve.delet(reserveId);
      setReminds(newRemids);
      Swal.fire(
        '您已取消預約囉',
        '可以到預約中查看預約狀態',
        'success',
      );
    });
  };
  const deletRecord = (id) => {
    const data = [...records];
    const newRecords = data.filter((list) => list.reserve_id !== id && list.process_id !== id);
    setRecords(newRecords);
    firebaseUsers.updateRecords(userId, newRecords);
  };

  useEffect(() => {
    setRecords(userInfo.records);
  }, [userInfo]);
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
        reminds.length === 0 && records.length === 0 ? (
          <Message>
            “你可以帮我洗個東西嗎”
            <br />
            “洗什麼”
            <br />
            “喜歡我”
          </Message>
        )
          : (
            reminds?.map?.((remind) => (
              <RemindCard
                remind={remind}
                key={remind.reserve_id}
                CancelReserve={CancelReserve}
              />
            ))
          )
      }
      {
        records?.map?.((record) => (
          <RecordCard
            record={record}
            key={record.reserve_id || record.process_id}
            deletRecord={deletRecord}
          />
        ))
      }
    </Wrapper>
  );
}

export default InformationPage;
