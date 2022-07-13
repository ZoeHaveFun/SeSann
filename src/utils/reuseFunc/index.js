/* eslint-disable max-len */
import dayjs from 'dayjs';
import {
  firebaseUsers, firebaseMachines, firebaseProcessing, firebaseStores,
} from '../firestore';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const writeInStoreOrderRecord = (userId, data) => {
  const newRecord = { ...data };
  newRecord.user_id = userId;
  firebaseStores.updateOrderRecord(newRecord.store_id, newRecord);
};

const writeInUserOrders = async (list) => {
  const userInfo = await firebaseUsers.get(list.user_id);
  const orderData = {};

  orderData.category = list.category;
  orderData.machine_id = list.machine_id;
  orderData.machine_name = list.machine_name;
  orderData.start_time = list.start_time;
  orderData.end_time = list.end_time;
  orderData.store_id = list.store_id;
  orderData.store_name = list.store_name;

  const newOrders = [...userInfo.orders, orderData];
  firebaseUsers.addOrders(userInfo.user_id, newOrders);

  writeInStoreOrderRecord(userInfo.user_id, orderData);
};

const archiveOrder = (data) => {
  data.forEach((list) => {
    writeInUserOrders(list);
    firebaseProcessing.delet(list.process_id);
    firebaseMachines.updateStatus(list.machine_id, 0);
  });
};

export const initialData = async (data) => {
  const finishedYMDH = await data.filter((list) => (
    (Number(dayjs(list.end_time.seconds * 1000).format('YYYY')) <= Number(dayjs().format('YYYY')))
    && (Number(dayjs(list.end_time.seconds * 1000).format('MM')) <= Number(dayjs().format('MM')))
    && (Number(dayjs(list.end_time.seconds * 1000).format('DD')) <= Number(dayjs().format('DD')))
    && (Number(dayjs(list.end_time.seconds * 1000).format('HH')) <= Number(dayjs().format('HH')))
  ));
  // console.log(finishedYMDH);

  // finishedYMDH.forEach((list) => {
  //   console.log(Number(dayjs(list.end_time.seconds * 1000).format('mm')));
  // });
  // console.log('NOW', Number(dayjs().format('mm')));

  const finishedData = finishedYMDH.filter((list) => Number(dayjs(list.end_time.seconds * 1000).format('mm')) <= Number(dayjs().format('mm')));

  archiveOrder(finishedData);
};

export const handleIdleMachines = (machines) => {
  const washMachine = machines.filter((machine) => machine.type === 'wash' && machine.status === 0);
  const dryMachine = machines.filter((machine) => machine.type === 'dry' && machine.status === 0);
  const petMachine = machines.filter((machine) => machine.type === 'pet' && machine.status === 0);
  return { wash: washMachine, dry: dryMachine, pet: petMachine };
};

export const totalCustomerRecord = (days, data) => {
  let customer;
  if (days === undefined) {
    customer = data.order_record.length;
  }
  if (days === 1) {
    const todayRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMMDD') === dayjs().format('YYYYMMDD'));
    customer = todayRecord.length;
  }
  if (days === 7) {
    const customerRecord = data.order_record.filter((record) => (
      ((dayjs(record.start_time.seconds * 1000).format('YYYYMM') === dayjs().format('YYYYMM')) && (Number(dayjs(record.start_time.seconds * 1000).format('DD')) >= Number(dayjs().format('DD')) - 7))
    ));

    customer = customerRecord.length;
  }
  return customer;
};

export const totalIncomeRecord = (days, data) => {
  let income;
  if (days === undefined) {
    income = data.order_record.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  if (days === 1) {
    const toddayRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMMDD') === dayjs().format('YYYYMMDD'));
    income = toddayRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  if (days === 7) {
    const customerRecord = data.order_record.filter((record) => (
      ((dayjs(record.start_time.seconds * 1000).format('YYYYMM') === dayjs().format('YYYYMM')) && (Number(dayjs(record.start_time.seconds * 1000).format('DD')) >= Number(dayjs().format('DD')) - 7))
    ));
    income = customerRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  return income;
};

export const operationCustomerRecord = (tab, time, data) => {
  let customer;
  if (tab === 'Today') {
    const newRecord = data.order_record.filter((record) => (dayjs(record.start_time.seconds * 1000).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD')) && (dayjs(record.start_time.seconds * 1000).format('HH') === time.split(':')[0]));
    customer = newRecord.length;
  }
  if (tab === '7Day') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYY/MM/DD') === time);
    customer = newRecord.length;
  }
  if (tab === 'Month') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('MMM DD') === time);

    customer = newRecord.length;
  }
  if (tab === 'Year') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('MMM') === time);

    customer = newRecord.length;
  }

  return customer;
};

export const operationIncomeRecord = (tab, time, data) => {
  let income;
  if (tab === 'Today') {
    const newRecord = data.order_record.filter((record) => (dayjs(record.start_time.seconds * 1000).format('YYYY/MM/DD') === dayjs().format('YYYY/MM/DD')) && (dayjs(record.start_time.seconds * 1000).format('HH') === time.split(':')[0]));

    income = newRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  if (tab === '7Day') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYY/MM/DD') === time);
    income = newRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  if (tab === 'Month') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('MMM DD') === time);
    income = newRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  if (tab === 'Year') {
    const newRecord = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('MMM') === time);
    income = newRecord.reduce((accu, curr) => accu + curr.category.price, 0);
  }
  return income;
};

export const DoughnutCustomerTime = (tab, data) => {
  let customerRecord;
  if (tab === 'Today') {
    const filterData = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMMDD') === dayjs().format('YYYYMMDD'));
    customerRecord = filterData;
  }
  if (tab === '7Day') {
    const filterData = data.order_record.filter((record) => (
      ((dayjs(record.start_time.seconds * 1000).format('YYYYMM') === dayjs().format('YYYYMM')) && (Number(dayjs(record.start_time.seconds * 1000).format('DD')) >= Number(dayjs().format('DD')) - 7))
    ));
    customerRecord = filterData;
  }
  if (tab === 'Month') {
    const filterData = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMM') === dayjs().format('YYYYMM'));
    customerRecord = filterData;
  }
  if (tab === 'Year') {
    const filterData = data.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYY') === dayjs().format('YYYY'));
    customerRecord = filterData;
  }
  const morningTime = customerRecord.filter((list) => (
    (Number(dayjs(list.start_time.seconds * 1000).format('HH')) > 2) && (Number(dayjs(list.start_time.seconds * 1000).format('HH')) <= 10)
  ));
  const afternoonTime = customerRecord.filter((list) => (
    (Number(dayjs(list.start_time.seconds * 1000).format('HH')) > 10) && (Number(dayjs(list.start_time.seconds * 1000).format('HH')) <= 18)
  ));
  const eveningTime = customerRecord.length - morningTime.length - afternoonTime.length;

  return [morningTime.length, afternoonTime.length, eveningTime];
};

const today = dayjs();
const todayLabels = () => {
  const labels = [];
  for (let i = 0; i <= 24; i += 1) {
    labels.push(`${String(i).padStart(2, '0')}:00`);
  }
  return labels;
};
const weekLabels = [
  dayjs().subtract(6, 'day').format('YYYY/MM/DD'),
  dayjs().subtract(5, 'day').format('YYYY/MM/DD'),
  dayjs().subtract(4, 'day').format('YYYY/MM/DD'),
  dayjs().subtract(3, 'day').format('YYYY/MM/DD'),
  dayjs().subtract(2, 'day').format('YYYY/MM/DD'),
  dayjs().subtract(1, 'day').format('YYYY/MM/DD'),
  today.format('YYYY/MM/DD'),
];
const monthLabels = () => {
  const labels = [];
  const endOfMonth = dayjs().endOf('month').$D;
  const thisMonth = dayjs().format('MMM');
  for (let i = 1; i <= endOfMonth; i += 1) {
    labels.push(`${thisMonth} ${String(i).padStart(2, '0')}`);
  }
  return labels;
};
const yearLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const handleLabels = (tab) => {
  let labels;
  if (tab === 'Today') {
    labels = todayLabels();
  }
  if (tab === '7Day') {
    labels = weekLabels;
  }
  if (tab === 'Month') {
    labels = monthLabels();
  }
  if (tab === 'Year') {
    labels = yearLabels;
  }
  return labels;
};

export const handleChartCustomerData = (tab, storeData) => {
  let customerData;
  if (tab === 'Today') {
    const labels = todayLabels();
    const data = [];
    for (let i = 0; i < labels.length; i += 1) {
      data.push(operationCustomerRecord(tab, labels[i], storeData));
    }
    customerData = data;
  }
  if (tab === '7Day') {
    const data = [];
    for (let i = 0; i < weekLabels.length; i += 1) {
      data.push(operationCustomerRecord(tab, weekLabels[i], storeData));
    }
    customerData = data;
  }
  if (tab === 'Month') {
    const labels = monthLabels();
    const data = [];
    for (let i = 0; i < labels.length; i += 1) {
      data.push(operationCustomerRecord(tab, labels[i], storeData));
    }
    customerData = data;
  }
  if (tab === 'Year') {
    const data = [];
    for (let i = 0; i < yearLabels.length; i += 1) {
      data.push(operationCustomerRecord(tab, yearLabels[i], storeData));
    }
    customerData = data;
  }
  return customerData;
};

export const handleChartIncomeData = (tab, storeData) => {
  let incomeData;
  if (tab === 'Today') {
    const labels = todayLabels();
    const data = [];
    for (let i = 0; i < labels.length; i += 1) {
      data.push(operationIncomeRecord(tab, labels[i], storeData));
    }
    incomeData = data;
  }
  if (tab === '7Day') {
    const data = [];
    for (let i = 0; i < weekLabels.length; i += 1) {
      data.push(operationIncomeRecord(tab, weekLabels[i], storeData));
    }
    incomeData = data;
  }
  if (tab === 'Month') {
    const labels = monthLabels();
    const data = [];
    for (let i = 0; i < labels.length; i += 1) {
      data.push(operationIncomeRecord(tab, labels[i], storeData));
    }
    incomeData = data;
  }
  if (tab === 'Year') {
    const data = [];
    for (let i = 0; i < yearLabels.length; i += 1) {
      data.push(operationIncomeRecord(tab, yearLabels[i], storeData));
    }
    incomeData = data;
  }
  return incomeData;
};
