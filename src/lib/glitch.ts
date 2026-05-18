import { animate, random } from 'animejs';

export const glitchText = (el: HTMLElement | string) => {
  const target = typeof el === 'string' ? document.querySelectorAll(el) : el;
  
  return animate(target, {
    translateX: () => random(-2, 2),
    translateY: () => random(-2, 2),
    skew: () => random(-5, 5),
    duration: 100,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop: 3,
    complete: () => {
      animate(target, {
        translateX: 0,
        translateY: 0,
        skew: 0,
        duration: 50,
      });
    }
  });
};

export const scrambleText = (el: HTMLElement, finalPath: string) => {
  const chars = '!@#$%^&*()_+{}:"<>?|[];\',./';
  let iteration = 0;
  
  const interval = setInterval(() => {
    el.innerText = finalPath
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return finalPath[index];
        }
        return chars[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= finalPath.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 30);
};
