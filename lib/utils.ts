export function getDuration(callData: any) {
  const startTime = new Date(callData.createdAt).getTime();
  const endTime = new Date(
    callData.call_end_time || callData.last_activity
  ).getTime();

  // Check if dates are valid
  if (isNaN(startTime) || isNaN(endTime) || startTime > endTime) {
    return "00:00:00";
  }

  const timediffence = endTime - startTime;
  const totalSeconds = Math.floor(timediffence / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export function calculateTotalMinutes(callData:any, costMap:any) {
  return callData.reduce((sum:number, item:any) => {
    const duration = item.call_duration || getDuration(item);
    const seconds = timeStringToSeconds(duration);
    const minutes = seconds / 60;

    const date = new Date(item.createdAt).toISOString().split("T")[0];
    costMap[date] = (costMap[date] || 0) + minutes;
    return sum + minutes;
  }, 0);
}
