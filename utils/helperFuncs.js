// this function takes an array of date ranges in this format:
// [{ start: Date, end: Date}]
// the array is first sorted, and then checked for any overlap
export function overlap(dateRanges) {
  const sortedRanges = dateRanges.sort((previous, current) => {
    // get the start date from previous and current
    const previousTime = previous.start.getTime();
    const currentTime = current.start.getTime();

    // if the previous time is the same as the current time
    if (previousTime === currentTime) {
      return 0;
    }

    // if the previous is earlier than the current
    if (previousTime < currentTime) {
      return -1;
    }

    // if the previous time is later than the current time
    return 1;
  });

  // return the final results
  return sortedRanges.reduce(
    (result, current, idx, arr) => {
      // get the previous range
      if (idx === 0) {
        return result;
      }
      const previous = arr[idx - 1];

      // check for any overlap
      const previousEnd = previous.end.getTime();
      const currentStart = current.start.getTime();
      const overlap = previousEnd >= currentStart;

      // store the result
      if (overlap) {
        // yes, there is overlap
        result.overlap = true;
        // store the specific ranges that overlap
        result.ranges.push({
          previous: previous,
          current: current,
        });
      }

      return result;

      // seed the reduce
    },
    { overlap: false, ranges: [] },
  );
}
