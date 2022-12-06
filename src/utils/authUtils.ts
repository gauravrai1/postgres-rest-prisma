interface IInterErrs {
    success: boolean;
    message: string;
  }

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+=\{\[\}\]|\\:;"'<,>.?\/])[A-Za-z\d~`!@#$%^&*()_\-+=\{\[\}\]|\\:;"'<,>.?\/]{8,16}$/;

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const validateEmail = (email: string): boolean => {
  if (!email.match(EMAIL_REGEX)) return false;
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (!password.match(PASSWORD_REGEX)) return false;
  return true;
};

export const validateEmailPassword = (
  email: string,
  password: string
): IInterErrs => {
  const isEmail = validateEmail(email);
  const isPassword = validatePassword(password);

  if (!isEmail && !isPassword) {
    return { success: false, message: "Enter a valid email & password." };
  }

  if (!isEmail) {
    return { success: false, message: "Enter a valid email." };
  }

  if (!isPassword) {
    return { success: false, message: "Enter a valid password." };
  }

  return { success: true, message: "" };
};
