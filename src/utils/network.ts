export function isOffline(): boolean {
  const test = navigator.onLine;

  if (test === true) {
    return false;
  } else {
    if ((navigator as any).connection) {
      if ((navigator as any).connection.downlink === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
