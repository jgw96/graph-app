registerAnimator(
  "passthrough",
  class {
    animate(currentTime, effect) {
      console.log("currentTime", currentTime);
      console.log("effect", effect);
      if (currentTime < 200) {
        effect.localTime = currentTime;
      }
    }
  }
);
