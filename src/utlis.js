import { ethers } from "ethers";
import { addressConstant } from "./abi/address";
import PONC from "./abi/PONC.json";

export const registerJournalist = async (signer, verification_id) => {
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await (
    await contractInstance.registerJournalist(verification_id)
  ).wait();
  console.log("response", res);
};

export const publishNews = async (signer, newsUri, journalistId, price) => {
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await (
    await contractInstance.publishNews(newsUri, price, journalistId)
  ).wait();
  console.log("response", res);
};

export const fetchMyNews = async (signer) => {
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.fetchMyNews();
  console.log("response", res);
};

//fetchAllPublishedNews
export const fetchAllPublishedNews = async (signer) => {
  const contractInstance = new ethers.Contract(
    addressConstant.POCN,
    PONC.abi,
    signer
  );
  const res = await contractInstance.fetchAllPublishedNews();
  console.log("response", res);
};
