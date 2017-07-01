import { flattenAnnotations } from './Annotations';

const example = {
  pages: [{
    blocks: [{
      paragraphs: [{
        words: [
          {symbols: [{text: 1}, {text: 2}]},
          {symbols: [{text: 3}, {text: 4}]}
        ],
      }, {
        words: [
          {symbols: [{text: 5}, {text: 6}]},
          {symbols: [{text: 7}, {text: 8}]}
        ],
      }],
    }, {
      paragraphs: [{
        words: [
          {symbols: [{text: 9}]},
        ]
      }],
    }],
  }, {
    blocks: [{
      paragraphs: [{
        words: [
          {symbols: [{text: 10}]},
        ]
      }],
    }],
  }],
};

it('flattens annotations correctly', () => {
  const flattened = flattenAnnotations(example);
  
  flattened.forEach((elem, idx) =>
    expect(elem.text).toBe(idx + 1));
});

