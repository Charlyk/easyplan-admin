import isPhoneNumberValid from "./isPhoneNumberValid";

const isPhoneInputValid = (inputNumber, country) => {
  const phoneNumber = inputNumber.replace(
    `${country.dialCode}`,
    '',
  );
  return phoneNumber.length === 0 || isPhoneNumberValid(inputNumber, country);
}

export default isPhoneInputValid
