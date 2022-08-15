import { useAddress, useMetamask, useWalletConnect, useCoinbaseWallet, useDisconnect } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { IoCloseCircleOutline } from "react-icons/io5";
import styles from "../../styles/utils.module.scss";


const Modal = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const disconnectWallet = useDisconnect();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = () => {
    onClose();
  };

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
<StyledModalTitle></StyledModalTitle>
          <a style={{cursor: 'pointer', height: '25px'}} onClick={handleCloseClick}>
            <IoCloseCircleOutline color={'black'}/>
          </a>
        </StyledModalHeader>
        <StyledModalBody>
            <StyledLoginBtn onClick={ () => { connectWithMetamask(); handleCloseClick();}}><StyledMetamask/> Metamask</StyledLoginBtn>
            <StyledLoginBtn onClick={ () => { connectWithWalletConnect(); handleCloseClick();}}><StyledWalletConnect/> WalletConnect</StyledLoginBtn>
            <StyledLoginBtn onClick={ () => { connectWithCoinbaseWallet(); handleCloseClick();}}><StyledCoinbase/> CoinBase</StyledLoginBtn>
        </StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("__next")
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
    padding-top: 10px;
    display: grid;
    grid-gap: 10px;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  color: black;
`;

const StyledModalTitle = styled.div`
  display: flex;
  align-content: center;
  font-size: 15px;
  color: black;
`;


const StyledModal = styled.div`
  background: white;
  color: black;
  width: 100%;
  max-width: 450px;
  height: 272px;
  border-radius: 5px;
  padding: 15px;
  margin: 20px;
`;
const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999999;
`;
const StyledLoginBtn = styled.div`
    display: flex;
    padding: 8px;
    border: 1px solid #666;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 10px;
    box-shadow: 0px 3px 10px -3px #666;
`;
const StyledMetamask = styled.div`
    background: url('/icons/metamask.svg');
    display: block;
    width: 40px;
    height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
`;
const StyledWalletConnect = styled.div`
    background: url('/icons/walletconnect.svg');
    display: block;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;
const StyledCoinbase = styled.div`
    background: url('/icons/coinbase.svg');
    display: block;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

export default Modal;
