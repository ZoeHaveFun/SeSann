/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import dayjs from 'dayjs';
import { useEffect, useState, useContext } from 'react';
import {
  firebaseUsers, firebaseMachines, firebaseProcessing, firebaseStores,
} from '../../utils/firestore';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  display: flex;
  background-color: #EFF0F2;
  padding: 10px 20px;
  & > span {
    flex: 1;
  }
`;

export function OrderList({ item }) {
  return (
    <Wrapper>
      <span>{`${item.store_name} ${dayjs(item.start_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span>{`$${item.category.price}`}</span>
    </Wrapper>
  );
}

export function ReserveList({ item }) {
  return (
    <Wrapper>
      <span>{`${item.store_name} ${dayjs(item.reserve_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span>{`預計到你的時間${dayjs(item.estimate_startTime.seconds * 1000).format('Ahh : mm')}`}</span>
    </Wrapper>
  );
}

export function ProcessinfList({ item }) {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const [countDown, setCountDown] = useState();

  useEffect(() => {
    const finishedInStore = (orderData) => {
      const newRecord = { ...orderData };
      newRecord.user_id = userInfo.user_id;
      firebaseStores.updateOrderRecord(newRecord.store_id, newRecord);
    };
    const finishedInUser = () => {
      const orderData = {};

      orderData.category = item.category;
      orderData.machine_id = item.machine_id;
      orderData.machine_name = item.machine_name;
      orderData.start_time = item.start_time;
      orderData.store_id = item.store_id;
      orderData.store_name = item.store_name;

      const newOrders = [...userInfo.orders, orderData];
      finishedInStore(orderData);
      firebaseUsers.addOrders(userInfo.user_id, newOrders);
      firebaseProcessing.delet(item.process_id);
      firebaseMachines.updateStatus(item.machine_id, 0);
    };
    if (item.process_id) {
      const handleCountDown = setInterval(() => {
        const endTimer = dayjs(item.end_time.seconds * 1000);
        const timeLeft = dayjs.duration(endTimer.diff(dayjs())).$d;
        if (timeLeft.minutes < 1 && timeLeft.seconds < 1) {
          clearInterval(handleCountDown);
          finishedInUser();
        } else {
          setCountDown(`${timeLeft.minutes} : ${timeLeft.seconds}`);
        }
      }, 1000);
    }
  }, [item.end_time, item.machine_id]);

  return (
    <Wrapper>
      <span>{`${item.store_name} ${dayjs(item.start_time.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')}`}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span id={item.process_id}>{`運轉倒數時間${countDown}`}</span>
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
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

OrderList.propTypes = {
  item: PropTypes.shape({
    address: PropTypes.string,
    start_time: PropTypes.number,
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
