# dynamotui

A simple Terminal UI (TUI) for DynamoDB

## Features

List tables (optionally with a filter) and get index information for the selected table and its indexes.


## Requirements

The `aws` CLI must be installed (this is used through `shelljs`) and configured
properly so calls like `aws dynamodb list-tables` work properly.

The current `node` LTS version (last tested on v10)


## Tech

This is a React + node.js app written with react-blessed.


## Install

(not published yet)
```bash
$ yarn global add dynamotui
```


## CLI

```
$ dynamotui --help

  Usage
    $ dynamotui

  Options
    --filter (will filter tables names that contains the passed filter )

  Examples
    $ dynamotui --filter=-dev
```
