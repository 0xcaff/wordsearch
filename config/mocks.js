Object.defineProperties(window, {
  matchMedia: {
    value: () => ({ matches: true }),
  },
  requestAnimationFrame: {
    value: (cb) => setTimeout(() => {
      const time = performance.now();
      cb(time);
    }, 0),
  },
});
