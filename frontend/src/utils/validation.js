export const validateEmail = (value = "") => {
  const normalized = value.trim().toLowerCase();
  const isValid = /^[^\s@]+@gmail\.com$/i.test(normalized);

  return {
    value: normalized,
    isValid,
    message: isValid ? "" : "Email must end with @gmail.com",
  };
};

export const validatePassword = (value = "") => {
  const lengthOk = value.length >= 6 && value.length <= 12;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValid = lengthOk && hasUpper && hasLower && hasNumber && hasSpecial;

  return {
    isValid,
    lengthOk,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  };
};
