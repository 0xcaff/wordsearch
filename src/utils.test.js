import { stddev, getSymbols, boundsOfVertices, mean, required, findExtrema } from './utils';

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
  const flattened = getSymbols(example);
  
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

  const bbox = boundsOfVertices(verts);

  expect(bbox).toMatchObject({minX: 0, minY: 0, maxX: 1, maxY: 1});
});

it('calculates the bbox of a point', () => {
  const verts = [{x: 10, y: 10}];
  const bbox = boundsOfVertices(verts);

  expect(bbox).toMatchObject({minX: 10, minY: 10, maxX: 10, maxY: 10});
});

it('calculates the bbox of a triangle', () => {
  const verts = [
    {x: 0, y: 0},
    {x: 10, y: 0},
    {x: 5, y: 5},
    {x: 0, y: 0},
  ];

  const bbox = boundsOfVertices(verts);
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

it('finds the extrema of a function', () => {
  const f = Math.sin;

  const { mins, maxes } = findExtrema({
    f,
    start: 0,
    end: 2 * Math.PI,
    stepSize: Math.PI / 8,
  });

  expect(mins).toHaveLength(1);
  expect(mins[0]).toBe(3 * Math.PI / 2);

  expect(maxes).toHaveLength(1);
  expect(maxes[0]).toBe(Math.PI / 2);
});

it('should throw if arguments are not specified', () => {
  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const { test = required('test') } = { };
  }).toThrow();

  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const { test = required('test') } = { test: 'here is a string' };

  }).not.toThrow();
});
