import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  
  // Custom ease for "paper-like" movement
  CustomEase.create('paper', 'M0,0 C0.4,0 0.2,1 1,1');
}

export * from 'gsap';
export { ScrollTrigger, CustomEase };
