const urlValidator = (s) => {
  try {
    new URL(s);
    return true;
  } catch (e) {
    return false;
  }
};

const isoDateValidator = (d) => {
  try {
    new Date(d);
    return true;
  } catch (e) {
    return false;
  }
};

export { urlValidator, isoDateValidator };
