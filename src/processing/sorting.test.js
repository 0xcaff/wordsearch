// Tests for sortWordSelected.

import { sortWordSelected } from './spatialUtils';

const data = [{
  it: 'should sort diagonal nodes downards and to the right from left to right',
  input: [
    {
      "text": "E",
      "boundingRect": {
        "minX": 104,
        "minY": 819,
        "maxX": 120,
        "maxY": 839
      }
    },
    {
      "text": "W",
      "boundingRect": {
        "minX": 157,
        "minY": 842,
        "maxX": 179,
        "maxY": 865
      }
    },
    {
      "text": "C",
      "boundingRect": {
        "minX": 116,
        "minY": 825,
        "maxX": 130,
        "maxY": 845
      }
    },
    {
      "text": "O",
      "boundingRect": {
        "minX": 139,
        "minY": 835,
        "maxX": 159,
        "maxY": 857
      }
    },
    {
      "text": "R",
      "boundingRect": {
        "minX": 124,
        "minY": 828,
        "maxX": 143,
        "maxY": 850
      }
    },
    {
      "text": "C",
      "boundingRect": {
        "minX": 64,
        "minY": 803,
        "maxX": 80,
        "maxY": 823
      }
    },
    {
      "text": "A",
      "boundingRect": {
        "minX": 76,
        "minY": 808,
        "maxX": 93,
        "maxY": 829
      }
    },
    {
      "text": "S",
      "boundingRect": {
        "minX": 51,
        "minY": 797,
        "maxX": 68,
        "maxY": 818
      }
    },
    {
      "text": "R",
      "boundingRect": {
        "minX": 89,
        "minY": 814,
        "maxX": 107,
        "maxY": 835
      }
    }
  ],
  output: 'SCARECROW',
}, {
  it: 'should sort horizontal nodes from left ot right',
  input: [
    {
      "text": "N",
      "boundingRect": {
        "minX": 1516,
        "minY": 2234,
        "maxX": 1572,
        "maxY": 2297
      },
    },
    {
      "text": "T",
      "boundingRect": {
        "minX": 1588,
        "minY": 2229,
        "maxX": 1651,
        "maxY": 2293
      },
    },
    {
      "text": "U",
      "boundingRect": {
        "minX": 1457,
        "minY": 2236,
        "maxX": 1513,
        "maxY": 2299
      },
    },
    {
      "text": "H",
      "boundingRect": {
        "minX": 1379,
        "minY": 2238,
        "maxX": 1442,
        "maxY": 2302
      },
    }
  ],
  output: 'HUNT',
}, {
  it: 'should sort diagonal nodes upwards and to the right from left to right',
  input: [
    {
      "text": "I",
      "boundingRect": {
        "minX": 1325,
        "minY": 451,
        "maxX": 1340,
        "maxY": 468
      }
    },
    {
      "text": "K",
      "boundingRect": {
        "minX": 1314,
        "minY": 456,
        "maxX": 1328,
        "maxY": 473
      }
    },
    {
      "text": "S",
      "boundingRect": {
        "minX": 1361,
        "minY": 436,
        "maxX": 1377,
        "maxY": 453
      }
    },
    {
      "text": "E",
      "boundingRect": {
        "minX": 1349,
        "minY": 441,
        "maxX": 1364,
        "maxY": 458
      }
    },
    {
      "text": "T",
      "boundingRect": {
        "minX": 1338,
        "minY": 446,
        "maxX": 1353,
        "maxY": 463
      }
    }
  ],
  output: 'KITES',
}, {
  it: 'should sort vertical nodes from top to bottom',
  input: [
    {
      "text": "S",
      "boundingRect": {
        "minX": 1314,
        "maxX": 1328,
        "minY": 496,
        "maxY": 503
      }
    },
    {
      "text": "T",
      "boundingRect": {
        "minX": 1338,
        "maxX": 1314,
        "minY": 436,
        "maxY": 453
      }
    },
    {
      "text": "T",
      "boundingRect": {
        "minX": 1314,
        "maxX": 1328,
        "minY": 510,
        "maxY": 538
      }
    },
    {
      "text": "E",
      "boundingRect": {
        "minX": 1314,
        "maxX": 1328,
        "minY": 466,
        "maxY": 483
      }
    }
  ],
  output: 'TEST',
}];

data.forEach(({ it: desc, input, output }) => {
  it(desc, () => {
    const selected = input.reduce((acc, val) => {
      acc.add(val);
      return acc
    }, new Set());

    const got = sortWordSelected(selected);
    const gotText = got.map(node => node.text).join('');

    expect(gotText).toBe(output);
  });
});
