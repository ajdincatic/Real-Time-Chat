export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return regex.test(password);
};

export const isNullOrEmpty = (str: string) => {
  if (!str) {
    return true; // no input
  }
  if (typeof str !== "string") {
    return false;
  }
  if (!str.trim()) {
    return true; // only spaces
  }
  return false;
};
