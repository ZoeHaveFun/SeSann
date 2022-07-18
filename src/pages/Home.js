/* eslint-disable max-len */
/* eslint-disable no-undef */
import {
  useEffect, useRef,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { ChevronsDown } from '@styled-icons/boxicons-solid';
import { parallaxUrl } from '../utils/reuseFunc';
import LaundryMap from '../components/laundryMap';
import StoreJoinForm from '../components/StoreJoinForm';
import UserRegisterForm from '../components/UserRegisterForm';
import Header from '../components/Header';

const StoreCard = styled.div`
  padding: 10px 20px;
  box-shadow: 0px 0px 8px #999;
  margin-bottom: 16px;
  display: flex;
  & > span {
    flex: 1;
  }
  & > span:nth-child(2) {
    flex: 2;
  }
`;
function Store({ item }) {
  return (
    <StoreCard>
      <span>{item.store_name}</span>
      <span>{item.address}</span>
      <span>{item.phone}</span>
      <button type="button">
        <Link to={`/store?store_id=${item.store_id}`}>查看更多</Link>
      </button>
    </StoreCard>
  );
}
Store.propTypes = {
  item: PropTypes.shape({
    store_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

const FirstLayer = styled.div`
  display: flex;
  flex-direction: column;
`;
const BannerWrapper = styled.div`
  width: 80%;
  position: relative;
  margin: auto;
  margin-top: 30px;
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 20px;
  &>img {
    width: calc(100% / 4);
    height: calc(100% / 4);
  }
  &>span:nth-child(4) {
    background-color: #1C5174;
    position: absolute;
    left: 0;
    bottom: 0;
    display: inline-block;
    width: 50%;
    height: 20px;
  }
`;
const FirstLayerBottom = styled.div`
  display: flex;
  justify-content: center;
  color: #1C5174;
`;
const Middle = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    text-align: center;
    > svg {
      margin-top: 30px;
      width: 40px;
    }
  }
`;
// const Button = styled.button`
//   font-family: 'Noto Sans TC', sans-serif;
//   padding: 8px 20px;
//   background-color: #023047;
//   color: #FEFCFB;
//   border-radius: 1rem;
//   font-size: 16px;
//   &:hover {
//     background-color: #FFB703;
//   }
// `;
const BoxWrapper = styled.div`
  width: 26%;
  box-shadow: 0px 0px 8px 2px #8B8C89;
  border-radius: 0.8rem;
  padding: 30px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1C5174;
  flex-direction: column;
  font-family: 'Noto Sans TC', sans-serif;
  &>p {
    font-size: 18px;
    color: #FEFCFB;
    line-height: 1.8rem;
  }
`;
const Title = styled.div`
  font-size: 44px;
  color: #FFB703;
  margin-bottom: 10px;
`;
const TitleDiv = styled.div`
  width: 80%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  font-family: 'Noto Sans TC', sans-serif;
  color:  #1C5174;
  & >h2 {
    font-size: 42px;
    margin-right: 10px;
    letter-spacing: 0.2rem;
  }
`;
const SecTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  span:nth-child(2) {
    display: inline-block;
    background-color: #DDE1E4;
    padding: 1px 8px;
    margin-top: 2px;
    width: 60px;
  }
`;

function Home() {
  const pathTo = useLocation().search.split('=')[1];
  const parallax = useRef(null);

  useEffect(() => {
    if (pathTo === 'about') {
      parallax.current.scrollTo(0);
    }
    if (pathTo === 'map') {
      parallax.current.scrollTo(5);
    }
    if (pathTo === 'join') {
      parallax.current.scrollTo(6);
    }
  }, [pathTo]);

  return (
    <>
      {/* <Header />
      <FirstBanner FirstBannerRef={FirstBannerRef} />
      <SectionA AboutRef={AboutRef} />
      <SectionB />
      <SectionC />
      <LaundryMap LaundryMapRef={LaundryMapRef} />
      <div style={{ padding: '20px' }}>
        {
          stores?.map((item) => <Store item={item} key={item.store_id} />)
        }
      </div>
      <UserRegisterForm JoinFormRef={JoinFormRef} />
      <StoreJoinForm /> */}
      <div style={{ width: '100%', height: '100vh' }}>
        <Parallax ref={parallax} pages={7} style={{ backgroundColor: '#FEFCFB' }}>
          <ParallaxLayer
            sticky={{ start: 0, end: 4 }}
            style={{ zIndex: '10', position: 'fixed', top: '0px' }}
          >
            <Header>Its Header</Header>
          </ParallaxLayer>
          <ParallaxLayer offset={0} speed={1} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={1} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={2} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={3} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={4} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={5} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />
          <ParallaxLayer offset={6} speed={-0} style={{ backgroundColor: '#FEFCFB' }} />

          <ParallaxLayer offset={0.1} speed={-0.1} style={{ zIndex: '101' }} onClick={() => parallax.current.scrollTo(1)}>
            <FirstLayer>
              <BannerWrapper>
                <img src={parallaxUrl('slider-image-1', 'ecad3964-01b3-4f8b-8701-63bb7819503d')} alt="slider1" />
                <img src={parallaxUrl('slider-image-2', '177822fc-c170-440c-b871-0d765f03dd15')} alt="slider2" />
                <img src={parallaxUrl('slider-image-3', '52292b27-cb75-442b-b003-e1b32fc609c3')} alt="slider3" />
              </BannerWrapper>
              <FirstLayerBottom>
                <Middle>
                  <div>
                    <h1>SéSann 是一個自助洗衣平台</h1>
                    <h2>SéSann is a self-service laundry platform</h2>
                  </div>
                  <div>
                    <h1>這個平台可以做什麼?</h1>
                    <h2>Waht&apos;s this platform for?</h2>
                    <ChevronsDown />
                  </div>
                </Middle>
              </FirstLayerBottom>
            </FirstLayer>

          </ParallaxLayer>

          <ParallaxLayer offset={1.1} speed={-0} style={{ pointerEvents: 'none' }}>
            <img src={parallaxUrl('mapBack', '689bba1e-79a1-4c6e-9b45-1fdbb36636ae')} style={{ width: '48%', marginLeft: '10%' }} alt="mapBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={1.5} speed={0.1} style={{ pointerEvents: 'none' }}>
            <img src={parallaxUrl('laundryMap', '6a15a6fc-ec42-422b-a721-337a8d3fb9c1')} style={{ width: '46%', marginLeft: '16%' }} alt="laundryMap" />
          </ParallaxLayer>
          <ParallaxLayer offset={1.2} speed={-0.2}>
            <img src={parallaxUrl('userLocation', 'f6bb67c9-190f-40f8-b4cc-58fc082bd0cc')} style={{ width: '18%', marginLeft: '24%' }} alt="userLocation" />
          </ParallaxLayer>
          <ParallaxLayer offset={1.48} speed={-0.1}>
            <img src={parallaxUrl('storeLocation', '840f002e-c7d8-41dc-85ee-9ad2515dfadb')} style={{ width: '36%', marginLeft: '18%' }} alt="storeLocation" />
          </ParallaxLayer>
          <ParallaxLayer offset={1.37} speed={-0.1}>
            <img src={parallaxUrl('storeIdelMachines', '798ec418-8684-4e08-a042-d1d47fde8525')} style={{ width: '10%', marginLeft: '44%' }} alt="storeIdelMachines" />
          </ParallaxLayer>
          <ParallaxLayer offset={1.4} speed={-0.2} style={{ marginLeft: '64%' }}>
            <BoxWrapper>
              <Title>洗衣地圖</Title>
              <p>
                平台專屬地圖 搜尋縣市或附近店家
                <br />
                在家也能馬上知道有沒有空閒機台
              </p>
            </BoxWrapper>
          </ParallaxLayer>

          <ParallaxLayer offset={2.2} speed={-0}>
            <img src={parallaxUrl('reserveBack', 'f1900c94-8334-47e6-9fdc-2e57a2abdfd4')} style={{ width: '50%', marginLeft: '40%' }} alt="reserveBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.28} speed={-0.1}>
            <img src={parallaxUrl('reserveLeftBack', '375f8bb3-48e5-40ad-9e52-a04c1b5035c4')} style={{ width: '20%', marginLeft: '46%' }} alt="reserveLeftBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.3} speed={-0.1}>
            <img src={parallaxUrl('reserveRightBack', 'f4039af9-7a80-4d0a-988f-bf7b409c6c52')} style={{ width: '18%', marginLeft: '73%' }} alt="reserveRightBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.24} speed={-0.2}>
            <img src={parallaxUrl('reservePage', 'b3c366e7-1876-4f6a-ace9-ad81fd559bd9')} style={{ width: '16%', marginLeft: '60%' }} alt="reservePage" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.6} speed={-0.2}>
            <img src={parallaxUrl('reserveGril', '42c07f17-f56e-4982-8a6e-f2dab5aa952e')} style={{ width: '16%', marginLeft: '70%' }} alt="reserveGril" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.5} speed={-0.3}>
            <img src={parallaxUrl('reserveSuccess', '6a3cdbb0-d451-424f-944c-f476f34b05fd')} style={{ width: '7%', marginLeft: '78%' }} alt="reserveSuccess" />
          </ParallaxLayer>
          <ParallaxLayer offset={2.4} speed={-0.2} style={{ marginLeft: '14%' }}>
            <BoxWrapper>
              <Title>線上預約</Title>
              <p>
                洗衣機都在使用中?
                <br />
                沒關係! 線上預約很方便
                <br />
                即時顯示預約人數和預計等待時間 不用癡癡等待
              </p>
            </BoxWrapper>
          </ParallaxLayer>

          <ParallaxLayer offset={3.26} speed={-0}>
            <img src={parallaxUrl('proccessBack', 'e920cea7-75b9-4e60-9491-f5bda1c7a87e')} style={{ width: '50%', marginLeft: '10%' }} alt="proccessBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={3.3} speed={-0.2}>
            <img src={parallaxUrl('clock', 'ccd0e337-14d4-4b52-a443-70f232597d4b')} style={{ width: '20%', marginLeft: '40%' }} alt="clock" />
          </ParallaxLayer>
          <ParallaxLayer offset={3.5} speed={-0.1}>
            <img src={parallaxUrl('calender', 'b1ef7115-bcc4-47f9-8236-7591279c6ce7')} style={{ width: '30%', marginLeft: '16%' }} alt="calender" />
          </ParallaxLayer>
          <ParallaxLayer offset={3.3} speed={-0.2}>
            <img src={parallaxUrl('proccessGril', 'ae7cc2ff-b5fa-467c-8cb9-5abfade766d1')} style={{ width: '14%', marginLeft: '22%' }} alt="proccessGril" />
          </ParallaxLayer>
          <ParallaxLayer offset={3.4} speed={-0.2} style={{ marginLeft: '62%' }}>
            <BoxWrapper>
              <Title>運轉倒數</Title>
              <p>
                還在自己算時間或是在洗衣店坐等衣服嗎?
                <br />
                SéSann 幫你算好好
                <br />
                剩餘時間清清楚楚
                <br />
                讓你拿回時間的主導權
              </p>
            </BoxWrapper>
          </ParallaxLayer>

          <ParallaxLayer offset={4.1} speed={-0}>
            <img src={parallaxUrl('backstageBack', '3ca7b4d8-61ab-40c3-89d5-012eff6d85bb')} style={{ width: '50%', marginLeft: '42%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={4.3} speed={-0.2}>
            <img src={parallaxUrl('backstagePage', '60c8d7b2-9814-4696-9a82-dbd62e0b2fe3')} style={{ width: '35%', marginLeft: '50%' }} alt="backstagePage" />
          </ParallaxLayer>
          <ParallaxLayer offset={4.4} speed={-0.1}>
            <img src={parallaxUrl('stagebackGril', '9532bf37-3bde-4098-b005-61071010d054')} style={{ width: '20%', marginLeft: '40%' }} alt="stagebackGril" />
          </ParallaxLayer>
          <ParallaxLayer offset={4.3} speed={-0.2} style={{ marginLeft: '12%' }}>
            <BoxWrapper>
              <Title>店家後台</Title>
              <p>
                超潮後台介面
                <br />
                可以管理機台 超方便
                <br />
                還有來客數與銷售額分析表
                <br />
                手握未來商機
              </p>
            </BoxWrapper>
          </ParallaxLayer>

          <ParallaxLayer offset={5}>
            <TitleDiv>
              <h2>找一找</h2>
              <SecTitle>
                <span>附近的自助洗衣</span>
                <span />
              </SecTitle>
            </TitleDiv>
          </ParallaxLayer>
          <ParallaxLayer offset={5} speed={-0.1}>
            <LaundryMap />
          </ParallaxLayer>

          <ParallaxLayer offset={6.34} speed={-0}>
            <img src={parallaxUrl('registerPig', '8602e74d-340c-4b0b-aac7-4886990ea1f8')} style={{ width: '35%', marginLeft: '12%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.48} speed={-0}>
            <img src={parallaxUrl('registerBack', 'b7ae1921-9c0e-4688-b3fa-55dd370ec90e')} style={{ width: '36%', marginLeft: '6%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.5} speed={-0}>
            <img src={parallaxUrl('registerRightBack', 'b7881178-7380-497e-aa00-24737a0e9400')} style={{ width: '10%', marginLeft: '38%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.86} speed={-0.1}>
            <img src={parallaxUrl('registerClock', '0a581d12-3f87-4c74-bdd5-fade7bc9705b')} style={{ width: '10%', marginLeft: '37%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.5} speed={-0.1}>
            <img src={parallaxUrl('registerGril', 'd35b84ba-ba55-49f9-9cb6-ed032a14745d')} style={{ width: '10%', marginLeft: '22%' }} alt="backstageBack" />
          </ParallaxLayer>

          <ParallaxLayer offset={6.1} speed={-0}>
            <img src={parallaxUrl('joinBack', '1b05d8c8-1aa5-432d-9565-f1e6f766625e')} style={{ width: '35%', marginLeft: '52%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.1} speed={-0.1}>
            <img src={parallaxUrl('joinBottom', '404f405b-20f0-4294-8e1e-02c992d956d0')} style={{ width: '35%', marginLeft: '52%' }} alt="backstageBack" />
          </ParallaxLayer>
          <ParallaxLayer offset={6.1} speed={-0.1}>
            <img src={parallaxUrl('joinStoreOwner', '55c0cdf6-cb35-49b6-99cc-317104b535ff')} style={{ width: '15%', marginLeft: '66%' }} alt="backstageBack" />
          </ParallaxLayer>

          <ParallaxLayer offset={6.08} speed={-0.1}>
            <TitleDiv>
              <h2>我要加入</h2>
              <SecTitle>
                <span>拿回被綁住的時間</span>
                <span />
              </SecTitle>
            </TitleDiv>
          </ParallaxLayer>
          <ParallaxLayer offset={6.08} speed={-0.1}>
            <UserRegisterForm />
          </ParallaxLayer>
          <ParallaxLayer offset={6.6} speed={-0.1} style={{ marginLeft: '40%' }}>
            <StoreJoinForm />
          </ParallaxLayer>
        </Parallax>

      </div>
    </>
  );
}

export default Home;
