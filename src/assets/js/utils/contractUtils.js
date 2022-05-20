import { ethers } from 'ethers';
import { addressConstant } from '@/abi/address';
import PONC from '@/abi/PONC.json';

export const registerJournalist = async (verification_id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await (
    await contractInstance.registerJournalist(verification_id)
  ).wait();
  console.log(res);
  if (res.transactionHash) {
    const journalistInfo = await getJournalistId(verification_id);
    console.log(journalistInfo);
    return journalistInfo;
  }
  // return res;
};

export const publishNews = async (newsUri, journalistId, price) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await (
    await contractInstance.publishNews(newsUri, price, journalistId)
  ).wait();
  console.log('response', res);
  return res;
};

export const fetchMyNews = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.fetchMyNews();
  // tokenURI
  console.log('response', res, parseInt(res[0].price));
  return res;
};

export const getURIById = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.tokenURI(id);
  // console.log('response', res, parseInt(res[0].price));
  return res;
};

//fetchAllPublishedNews
export const fetchAllPublishedNews = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.fetchAllPublishedNews();
  // console.log('response', res);
  return res;
};

export const getJournalistId = async (verification_id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.getJournalistId(verification_id);
  // console.log('response', res);
  return res;
};
//
