/**
 * Count all rows inside a csv file
 * @param {File} file
 */
const getCSVRowsCount = async (file) => {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target.result;
      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.length > 0);
      resolve(lines.length);
    };
    reader.readAsText(file);
  });
};

export default getCSVRowsCount;
