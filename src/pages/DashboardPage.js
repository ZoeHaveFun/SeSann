/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,

} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components/macro';
import { firebaseStores } from '../utils/firestore';
import {
  DoughnutCustomerTime, handleLabels, handleChartCustomerData, handleChartIncomeData,
} from '../utils/reuseFunc';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
    },
  },
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

const BarWrapper = styled.div`
  width: calc(100% / 3 * 2 );
`;
const DoughnutWrapper = styled.div`
  width: calc(100% / 3 );
  padding: 20px;
`;

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;
const TabWrapper = styled.div`
  margin-left: 16px;
`;
const Tab = styled.button`
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  color: ${(props) => (props.isSelect ? '#FEFCFB' : '#8B8C89')};
  padding: 4px 14px;
  border-radius: 0.6rem;
  box-shadow: 0px 0px 4px #8B8C89;
  background-color: ${(props) => (props.isSelect ? '#ebb12b' : '')};
  cursor: pointer;
  &+& {
    margin-left: 16px;
  }
  &:hover{
    color: ${(props) => (props.isSelect ? '#FEFCFB' : '#1C5174')};
    background-color: ${(props) => (props.isSelect ? '#ebb12b' : '#FEFCFB')};
    box-shadow: 0px 0px 2px 1px #8B8C89;
  }
`;
function DashboardPage() {
  const storeId = useContext(firebaseStores.CurrentStoreIdContext);
  const [storeData, setStoreData] = useState({});
  const [customerData, setCustomerData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [customerTime, setCustomerTime] = useState([]);
  const [selectTab, setSelectTab] = useState('7Day');
  const [barLabels, setbarLabels] = useState([]);

  const chartDoughnutData = {
    labels: ['早上 02:00-10:00', '中午 10:00-18:00', '晚上 18:00-02:00'],
    datasets: [
      {
        label: '# of Votes',
        data: customerTime,
        backgroundColor: [
          'rgba(251, 133, 0, 0.4)',
          'rgba(255, 183, 3, 0.4)',
          'rgba(33, 158, 188, 0.4)',
        ],
        borderColor: [
          'rgba(251, 133, 0, 1)',
          'rgba(255, 183, 3, 1)',
          'rgba(33, 158, 188, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartBarData = {
    labels: barLabels,
    datasets: [
      {
        label: '來客數',
        data: customerData,
        backgroundColor: 'rgba(253, 114, 29, 0.5)',
      },
      {
        label: '銷售額',
        data: incomeData,
        backgroundColor: 'rgba(253, 191, 49, 0.5)',
      },
    ],
  };
  const changeRange = (tab) => {
    setSelectTab(tab);
    setbarLabels(handleLabels(tab));
    setCustomerData(handleChartCustomerData(tab, storeData));
    setIncomeData(handleChartIncomeData(tab, storeData));
    setCustomerTime(DoughnutCustomerTime(tab, storeData));
  };
  useEffect(() => {
    if (Array.isArray(storeData?.order_record)) {
      setbarLabels(handleLabels(selectTab));
      setCustomerData(handleChartCustomerData(selectTab, storeData));
      setIncomeData(handleChartIncomeData(selectTab, storeData));

      const doughnutData = DoughnutCustomerTime(selectTab, storeData);
      setCustomerTime(doughnutData);
    }
  }, [storeData]);
  useEffect(() => {
    if (storeId) {
      const updateStoreData = (newData) => {
        setStoreData(newData);
      };
      return firebaseStores.onOneStoreShot(storeId, updateStoreData);
    }
    return undefined;
  }, [storeId]);
  return (
    <>
      <NavWrapper>
        Rang
        <TabWrapper>
          <Tab isSelect={selectTab === 'Today'} onClick={() => { changeRange('Today'); }}>Today</Tab>
          <Tab isSelect={selectTab === '7Day'} onClick={() => { changeRange('7Day'); }}>7 Day</Tab>
          <Tab isSelect={selectTab === 'Month'} onClick={() => { changeRange('Month'); }}>Month</Tab>
          <Tab isSelect={selectTab === 'Year'} onClick={() => { changeRange('Year'); }}>Year</Tab>
        </TabWrapper>
      </NavWrapper>
      <Wrapper>
        <BarWrapper>
          <Bar options={options} data={chartBarData} />
        </BarWrapper>
        <DoughnutWrapper>
          <Doughnut data={chartDoughnutData} />
        </DoughnutWrapper>
      </Wrapper>
    </>
  );
}

export default DashboardPage;
