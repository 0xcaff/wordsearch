<h1 align='center'>
  <a href='https://solver.0xcaff.me'>
    <img src='./public/favicon.png' height='128' />
  </a>

  <br />
  <br />

  The Wordsearch Solver
</h1>

<h3 align='center'>
  A wordsearch solver with quick image input and an interactive viewer.
</h3>

<p align='center'>
  <a href='https://travis-ci.org/0xcaff/wordsearch'>
    <img src='https://travis-ci.org/0xcaff/wordsearch.svg?branch=master' />
  </a>

  <a href='https://solver.0xcaff.me'>
    <img src='https://img.shields.io/badge/view-live-brightgreen.svg' />
  </a>
</p>

Solving a wordsearch is basically two dimensional string search. This wordsearch
solver makes it easy to input wordsearches, solve them and view the results
interactively.

How it Works
------------

There are two ways to enter a puzzle into this solver.

1. Using a text input. The puzzle and words are entered into text boxes. DraftJS
   is used for the puzzle text box to ensure that the area around each letter is
   a square instead of a rectangle for easier input.

   ![text-input][text-input]

2. Using an image selector. After an image is selected, it is sent to the google
   cloud vision api which returns a list of letters in the image and their
   bounding boxes. The user is prompted to select the region of the puzzle and
   the regions of each of the words in the image. The selected letters from the
   puzzle are arranged into a grid of letters using a kernel density estimator
   to find the rows and columns making up the puzzle, then finding the
   letters nearest to grid intersections.

   ![image-input][image-input]

Now that the puzzle and the words to find have been imported we have enough
information to send to the wordsearch solver algorithm.

The wordsearch solver algorithm takes in a puzzle along with a list of words and
returns a list of matches (word -> list of nodes making up a word).

The result is displayed in an interactive viewer.

![view][view]

[view]: ./assets/screenshots/view.png
[image-input]: https://0xcaff.github.io/static/wordsearch/image-input.gif
[text-input]: https://0xcaff.github.io/static/wordsearch/text-input.gif
