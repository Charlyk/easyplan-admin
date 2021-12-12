const isPhoneNumberValid = (phone, country) => {
  const phoneNumber = phone.replace(`${country.dialCode}`, '');
  return phoneNumber.length >= 4;
};

export default isPhoneNumberValid;
