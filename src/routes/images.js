import butterfly from '../wordsearch/images/butterfly.jpg';
import the from '../wordsearch/images/the.jpg';
import autumn from '../wordsearch/images/autumn word find.jpg';

export const images = [
  { name: 'butterfly', image: butterfly },
  { name: 'the', image: the },
  { name: 'autumn', image: autumn },
];

export const dict = images.reduce(
  (acc, { name, ...value }) => {
    acc[name] = value;

    return acc;
  }, {},
);
