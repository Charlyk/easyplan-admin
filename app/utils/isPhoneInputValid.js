const isPhoneInputValid = (inputNumber, country) => {
  const phoneNumber = inputNumber.replace(
    `${country.dialCode}`,
    '',
  );
  return phoneNumber.length >= 4;
}

export default isPhoneInputValid
