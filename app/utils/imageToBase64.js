const imageToBase64 = (imageFile) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(imageFile);
  });

export default imageToBase64;
