/**
 * Converts a duration in milliseconds to a human-readable string.
 */
export function msToDuration(duration: number) {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (hours > 0) {
    return hours + " hr " + minutes + " min";
  } else {
    return minutes + " min " + seconds + " sec";
  }
}

/**
 * Converts a duration in milliseconds to a string in the format "hh:mm:ss" or
 * "mm:ss" if hours are 0.
 */
export function msToDurationShort(duration: number) {
  let seconds: string | number = Math.floor((duration / 1000) % 60),
    minutes: string | number = Math.floor((duration / (1000 * 60)) % 60),
    hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (hours > 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
}
