import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { firebaseProcessing, firebaseUsers } from '../../firestore';

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
      <span>{`${item.store_name} ${dayjs(item.start_time).format('YYYY/MM/DD HH:mm:ss')}`}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span>{`$${item.category.price}`}</span>
    </Wrapper>
  );
}

export function ReserveList({ item }) {
  return (
    <Wrapper>
      <span>{item.store_name}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span>{`預計等待時間${item.reserve_time}`}</span>
    </Wrapper>
  );
}

export function ProcessinfList({ item }) {
  const [timeOut, setTimeOut] = useState();
  useEffect(() => {
    if (item.process_id) {
      // const stopProcess = () => {
      //   clearInterval(countDown);
      // };
      setInterval(() => {
        const endTimer = dayjs(item.end_time);
        const timeLeft = dayjs.duration(endTimer.diff(dayjs())).$d;
        if (timeLeft.minutes < 1 && timeLeft.seconds < 1) {
          // stopProcess();
          const ordersData = {};
          firebaseProcessing.getOne(item.process_id)
            .then((res) => {
              ordersData.category = res.category;
              ordersData.machine_id = res.machine_id;
              ordersData.machine_name = res.machine_name;
              ordersData.start_time = res.start_time;
              ordersData.store_name = res.store_name;

              return firebaseUsers.addOrders(res.user_id, ordersData);
            });
          // .then((res.process_id) => console.log();)
        } else {
          setTimeOut(`${timeLeft.minutes} : ${timeLeft.seconds}`);
        }
      }, 1000);
    }
  }, [item.end_time, item.process_id]);

  return (
    <Wrapper>
      <span>{item.store_name}</span>
      <span>{item.machine_name}</span>
      <span>{`${item.category.name} ${item.category.time}分鐘`}</span>
      <span id={item.process_id}>{`運轉倒數時間${timeOut}`}</span>
    </Wrapper>
  );
}

ProcessinfList.propTypes = {
  item: PropTypes.shape({
    process_id: PropTypes.string.isRequired,
    end_time: PropTypes.number,
    start_time: PropTypes.number,
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
    reserve_time: PropTypes.string.isRequired,
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
