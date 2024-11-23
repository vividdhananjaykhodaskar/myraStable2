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