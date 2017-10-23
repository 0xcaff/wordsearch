<h1 align='center'>
  <a href='https://solver.0xcaff.me'>
    <img src='./assets/favicon.png' height='128' />
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

Wordsearches are basically higher dimensional string search. Solving them is the
perfect job for computers. This wordsearch solver makes it easy to input
wordsearches, solve them and view the results interactively.

How it Works
------------

There are two ways to enter a puzzle into this solver.

1. A text input flow. The puzzle and words are entered into a text box.

2. An image input flow. An image is entered and regions containing the puzzle
   and words are selected by the user. After the image is selected, it is sent
   to the google cloud vision api which returns a list of bounding boxes and
   letters associated with them. The user is prompted to select the region of
   the puzzle and the regions of the words. The letters of the selected puzzle
   are turned into a grid using kernel density estimators to find the locations
   of the rows and columns. A kernel density estimator is a higher order
   function which takes in data and returns a function with maximums where the
   most datapoints occur and minimums where the least occur. Words are extracted
   by sorting selected bounding boxes from left to right.

Now that the puzzle and the words to find have been imported we have enough
information to send to the wordsearch solver algorithm.

The wordsearch solver algorithm takes in a puzzle along with a list of words and
returns a list of matches (word -> list of nodes making up a word).

The result is displayed in an interactive viewer. Mosuing over a letter in the
puzzle highlights the letters which are part of the word the letter is part of
and the word in the word list. When mousing over a word in the word list, all
instance of the word in the puzzle are highlighted.

![view][view]

Demo
----

TODO: Make a demo video.

[view]: ./assets/screenshots/view.png
