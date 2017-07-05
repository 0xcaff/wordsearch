import { stddev, flatten, bounds, mean } from './Annotations';

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
  const flattened = flatten(example);
  
  flattened.forEach((elem, idx) =>
    expect(elem.text).toBe(idx + 1));
});

it('calculates the bbox of a box of vertices', () => {
  const verts = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 0, y: 1},
  ];

  const bbox = bounds(verts);

  expect(bbox).toMatchObject({minX: 0, minY: 0, maxX: 1, maxY: 1});
});

it('calculates the bbox of a point', () => {
  const verts = [{x: 10, y: 10}];
  const bbox = bounds(verts);

  expect(bbox).toMatchObject({minX: 10, minY: 10, maxX: 10, maxY: 10});
});

it('calculates the bbox of a triangle', () => {
  const verts = [
    {x: 0, y: 0},
    {x: 10, y: 0},
    {x: 5, y: 5},
    {x: 0, y: 0},
  ];

  const bbox = bounds(verts);
  expect(bbox).toMatchObject({minX: 0, minY: 0, maxX: 10, maxY: 5});
});

it('calculates the mean', () => {
  const m = mean(2, 4, 4, 4, 5, 5, 7, 9);
  expect(m).toBe(5);
});

it('calculates the standard deviation', () => {
  const { dev } = stddev(2, 4, 4, 4, 5, 5, 7, 9);
  expect(dev).toBe(2);
});

