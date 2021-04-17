export default function createContainerHours(hours) {
  const updateHours = [];
  for (let hour of hours) {
    const hourParts = hour.split(':');
    const [hours, minutes] = hourParts;
    updateHours.push(hour);
    if (minutes === '00') {
      updateHours.push(`${hours}:15`);
    } else if (minutes === '30') {
      updateHours.push(`${hours}:45`);
    }
  }
  return updateHours;
};
