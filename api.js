'use strict';
const React = require('react');
const shell = require('shelljs');

const { useState, useEffect } = React;

const callDynamo = command =>
  new Promise((resolve, reject) =>
    shell.exec(
      `aws dynamodb ${command} --output json`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code) {
          reject(stderr);
        } else resolve(JSON.parse(stdout));
      }
    )
  );

const useDynamo = (command, { skip } = {}) => {
  const [{ loading, error, data }, setResult] = useState({ loading: true });

  useEffect(() => {
    if (!skip) {
      setResult({ loading: true });
      callDynamo(command)
        .then(data => setResult({ data }))
        .catch(error_ => setResult({ error: error_ }));
    }
  }, [command, skip]);

  return { loading, error, data };
};

module.exports = {
  useDynamo,
  callDynamo,
};
