/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components/macro';
import { PropTypes } from 'prop-types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { MonetizationOn, Adjust, Album } from '@styled-icons/material-rounded';
import { Link } from 'react-router-dom';
import DefaultstoreMainImg from '../../style/imgs/storeMainImg.jpg';
import Loading from '../Loading';
import { archiveOrder } from '../../utils/reuseFunc';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
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
const TimeLineWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 0px 20px;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
`;
const TimeLine = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  justify-content: space-between;
  color: #8B8C89;
  &>svg{
    width: 18px;
    color: #DDE1E4;
  }
  &>span {
    position: absolute;
    top: 16px;
    left: 18px;
    width: calc(100% - 36px);
    text-align: center;
    border-bottom: 2px #DDE1E4 solid;
    >span {
      display: block;
      margin-bottom: 4px;
      margin-top: 8px;
    }
  }
`;
const TimeDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const StartDiv = styled(TimeDiv)`
  align-items: flex-start;
  margin-right: 16px;
`;
const EndDiv = styled(TimeDiv)`
  align-items: flex-end;
  margin-left: 16px;
`;
const ConsumItem = styled.div`
  width: 140px;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  border-left: 1px #DDE1E4 solid;
  &>div{
    font-size: 22px;
    display: flex;
    >svg{
      width: 18px;
      margin-right: 2px;
      color: #8B8C89;
    }
  }
`;
const ConsumItemHaveBtn = styled.div`
width: 140px;
color: #1C5174;
font-family: 'Noto Sans TC', sans-serif;
display: flex;
align-items: flex-end;
justify-content: center;
flex-direction: column;
border-left: 1px #DDE1E4 solid;
padding-left: 20px;
&>div{
  font-size: 16px;
  display: flex;
  >svg{
    width: 16px;
    margin-right: 2px;
    color: #8B8C89;
  }
}
`;
const Button = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 4px 10px;
  color: #8B8C89;
  box-shadow: 0px 0px 4px #8B8C89;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  border-radius: 0.8rem;
  &:hover {
    background-color: #B64A41;
    color: #FEFCFB;
  }
`;
export function OrderList({ item }) {
  return (
    <Wrapper>
      <Link to={`/store?store_id=${item.store_id}`}>
        <StorePart>
          <div>
            <StoreImg src={DefaultstoreMainImg} />
            <span>{item.store_name}</span>
          </div>
          <span>{`${dayjs(item.start_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
        </StorePart>
      </Link>
      <TimeLineWrapper>
        <StartDiv>
          <span>{dayjs(item.start_time.seconds * 1000).format('hh : mm A')}</span>
          <span>開始</span>
        </StartDiv>
        <TimeLine>
          <Album />
          <span>
            <span>{`${item.category.time} m`}</span>
          </span>
          <Album />
        </TimeLine>
        <EndDiv>
          <span>{dayjs(item.end_time.seconds * 1000).format('hh : mm A')}</span>
          <span>結束</span>
        </EndDiv>
      </TimeLineWrapper>
      <ConsumItem>
        <div>
          <MonetizationOn />
          {item.category.price}
        </div>
        <span>{item.category.name}</span>
        <span>{item.machine_name}</span>
      </ConsumItem>
    </Wrapper>
  );
}

export function ReserveList({ item, CancelReserve }) {
  return (
    <Wrapper>
      <Link to={`/store?store_id=${item.store_id}`}>
        <StorePart>
          <div>
            <StoreImg src={DefaultstoreMainImg} />
            <span>{item.store_name}</span>
          </div>
          <span>{`${dayjs(item.reserve_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
        </StorePart>
      </Link>
      <TimeLineWrapper>
        <StartDiv>
          <span>{dayjs(item.estimate_startTime.seconds * 1000).format('hh : mm A')}</span>
          <span>預計開始</span>
        </StartDiv>
        <TimeLine>
          <Adjust />
          <span>
            <span>{`${item.category.time} m`}</span>
          </span>
          <Adjust />
        </TimeLine>
        <EndDiv>
          <span>{dayjs(item.estimate_endTime.seconds * 1000).format('hh : mm A')}</span>
          <span>預計結束</span>
        </EndDiv>
      </TimeLineWrapper>
      <ConsumItemHaveBtn>
        <div>
          <MonetizationOn />
          {item.category.price}
        </div>
        <span>{item.category.name}</span>
        <span>{item.machine_name}</span>
        <Button cancel onClick={() => CancelReserve(item.machine_id, item.reserve_id)}>
          取消預約
        </Button>
      </ConsumItemHaveBtn>
    </Wrapper>
  );
}

export function ProcessinfList({ item }) {
  const [countDown, setCountDown] = useState('');

  useEffect(() => {
    if (item.process_id) {
      const handleCountDown = setInterval(() => {
        const endTimer = dayjs(item.end_time.seconds * 1000);
        const timeLeft = dayjs.duration(endTimer.diff(dayjs())).$d;
        if (timeLeft.minutes < 1 && timeLeft.seconds < 1) {
          clearInterval(handleCountDown);
          archiveOrder([item]);
        } else {
          setCountDown(`${timeLeft.minutes} : ${timeLeft.seconds}`);
        }
      }, 1000);
    }
  }, [item.end_time, item.machine_id]);

  return (
    <Wrapper>
      <Link to={`/store?store_id=${item.store_id}`}>
        <StorePart>
          <div>
            <StoreImg src={DefaultstoreMainImg} />
            <span>{item.store_name}</span>
          </div>
          <span>{`${dayjs(item.start_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
        </StorePart>
      </Link>
      <TimeLineWrapper>
        <StartDiv>
          <span>{dayjs(item.start_time.seconds * 1000).format('hh : mm A')}</span>
          <span>開始</span>
        </StartDiv>
        <TimeLine>
          <Album />
          <span>
            { countDown ? <span>{`${countDown} m`}</span>
              : <Loading />}
          </span>
          <Adjust />
        </TimeLine>
        <EndDiv>
          <span>{dayjs(item.end_time.seconds * 1000).format('hh : mm A')}</span>
          <span>預計結束</span>
        </EndDiv>
      </TimeLineWrapper>
      <ConsumItem>
        <div>
          <MonetizationOn />
          {item.category.price}
        </div>
        <span>{item.category.name}</span>
        <span>{item.machine_name}</span>
      </ConsumItem>
    </Wrapper>
  );
}

ProcessinfList.propTypes = {
  item: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    process_id: PropTypes.string.isRequired,
    end_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    start_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    machine_id: PropTypes.string.isRequired,
    machine_name: PropTypes.string.isRequired,
    store_id: PropTypes.string,
    store_name: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
ReserveList.propTypes = {
  item: PropTypes.shape({
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
    estimate_endTime: PropTypes.shape({
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

OrderList.propTypes = {
  item: PropTypes.shape({
    address: PropTypes.string,
    start_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    end_time: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    machine_id: PropTypes.string.isRequired,
    machine_name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    store_id: PropTypes.string,
    store_name: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
