registerAnimator(
  "loading",
  class {
    animate(currentTime, effect) {
      effect.localTime = currentTime;
    }
  }
);
