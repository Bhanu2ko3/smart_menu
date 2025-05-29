export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type || 'tween',
      delay: delay || 0,
      duration: duration || 1,
      ease: 'easeOut',
    },
  },
});

export const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    
    y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type: type || 'tween',
      delay: delay || 0,
      duration: duration || 0.5,
      ease: 'easeOut',
    },
  },
});

export const zoomIn = (delay, duration) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'tween',
      delay: delay || 0,
      duration: duration || 0.5,
      ease: 'easeOut',
    },
  },
});