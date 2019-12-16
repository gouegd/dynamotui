#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const {render} = require('ink');
const meow = require('meow');

const ui = importJsx('./ui');

const cli = meow(`
	Usage
	  $ dynacli

	Options
	  --filter  A filter on the tables to be listed

	Examples
	  $ dynacli
	  Will list all tables

	  $ dynacli --filter='-dev'
	  Will list all tables containing '-dev'
`);

render(React.createElement(ui, cli.flags), {experimental: true});
