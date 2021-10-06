export const initIdle = async () => {
  if ("IdleDetector" in window) {
    // Idle Detector API supported

    const state = await (window as any).IdleDetector.requestPermission();
    if (state !== "granted") {
      // Need to request permission first.
      return console.log("Idle detection permission not granted.");
    } else {
      try {
        const controller = new AbortController();
        const signal = controller.signal;

        const idleDetector = new (window as any).IdleDetector();

        await idleDetector.start({
          threshold: 60000,
          signal,
        });
        console.log("IdleDetector is active.");

        return idleDetector;
      } catch (err) {
        // Deal with initialization errors like permission denied,
        // running outside of top-level frame, etc.
        console.error(err.name, err.message);
      }
    }
  }
};
