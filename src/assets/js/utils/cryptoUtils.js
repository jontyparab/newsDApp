const randomIntUUID = () => {
  //   return BigInt('0x' + crypto.randomUUID().replaceAll('-', ''));
  return Number(
    '0x' + crypto.randomUUID().substring(0, 15).replaceAll('-', '')
  );
};

export { randomIntUUID };
