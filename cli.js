#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const blessed = require('neo-blessed');
const { createBlessedRenderer } = require('react-blessed');
const render = createBlessedRenderer(blessed);

const meow = require('meow');

const App = importJsx('./app');

const cli = meow(`
  Usage
    $ dynamotui

  Options
    --filter Pass a name, it will filter out tables names that do not contain it

  Examples
    $ dynamotui --filter=-dev
`);

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'dynamotui',
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Rendering the React app using our screen
render(React.createElement(App, cli.flags), screen);
