import styled from 'styled-components/macro';
import useWeb from '../../style/imgs/useWeb.jpg';
import scanQrCode from '../../style/imgs/scanQrCode.png';
import laundryMap from '../../style/imgs/laundryMap.jpg';

const Banner = styled.div`
  background-image: url(${(props) => props.img});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  padding: 40px 50px;
`;

function SectionA() {
  return (
    <Banner img={laundryMap}>
      <h1>
        洗衣地圖
        <br />
        搜尋小幫手
      </h1>
    </Banner>

  );
}

function SectionB() {
  return (
    <Banner img={useWeb}>
      <h1>
        在線預定
        <br />
        洗衣更從容
      </h1>
    </Banner>
  );
}

function SectionC() {
  return (
    <Banner img={scanQrCode}>
      <h1>
        掃碼洗衣
        <br />
        快速方便
      </h1>
    </Banner>

  );
}

export { SectionA, SectionB, SectionC };
