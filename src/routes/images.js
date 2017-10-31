import butterfly from 'wordsearch-algo/images/butterfly.jpg';
import the from 'wordsearch-algo/images/the.jpg';
import autumn from 'wordsearch-algo/images/autumn word find.jpg';

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
