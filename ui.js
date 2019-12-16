'use strict';
const React = require('react');
const T = require('prop-types');
const {Text, Color, Box, useInput, useApp} = require('ink');
const shell = require('shelljs');
const SelectInput = require('ink-select-input').default;
const Spinner = require('ink-spinner').default;

const {useState, useEffect, memo} = React;

const callDynamo = command =>
	new Promise((resolve, reject) =>
		shell.exec(
			`aws dynamodb ${command} --output json`,
			{silent: true},
			(code, stdout, stderr) => {
				if (code) {
					reject(stderr);
				} else resolve(JSON.parse(stdout));
			}
		)
	);

const useDynamo = (command, inputs = [], {skip} = {}) => {
	const [{loading, error, data}, setResult] = useState({loading: true});

	useEffect(() => {
		if (!skip) {
			setResult({loading: true});
			callDynamo(command)
				/* eslint-disable-next-line promise/prefer-await-to-then */
				.then(data => setResult({data}))
				.catch(error_ => setResult({error: error_}));
		}
	}, [command, skip]);

	return {loading, error, data};
};

const KeySchema = ({data}) => (
	<Box>
		{data.map(({AttributeName, KeyType}) => (
			<Box key={KeyType} marginRight={1}>
				<Text bold={KeyType === 'HASH'}>{AttributeName}</Text>
			</Box>
		))}
	</Box>
);

KeySchema.propTypes = {
	data: T.arrayOf(T.object.isRequired).isRequired
};

const Indexes = memo(({data, color}) => {
	const colorProp = {[color]: true};
	return data.map(index => {
		return (
			<Box key={index.IndexName}>
				<Box marginRight={3}>
					<Text bold>
						<Color {...colorProp}>{index.IndexName}</Color>
					</Text>
				</Box>
				<Box>
					<KeySchema data={index.KeySchema} />
				</Box>
			</Box>
		);
	});
});

const Ixes = () => <Box><Text>One lala lala</Text><Text>Two lalalalalala</Text></Box>

Indexes.propTypes = {
	data: T.object.isRequired,
	color: T.oneOf(['yellow', 'green']).isRequired
};

const TableDetails = memo(({data}) => {
	const lsis = data.LocalSecondaryIndexes || [];
	const gsis = data.GlobalSecondaryIndexes || [];
	return (
		<Box flexDirection="column">
			<Box>
				<Text bold>
					<Color cyan>{data.TableName}</Color>
				</Text>
			</Box>
			<Box>
				<KeySchema data={data.KeySchema} />
			</Box>
			<Box>
				<Text bold>
					<Color yellow>{lsis.length} LSI</Color>
				</Text>
			</Box>
			<Box>
				<Text bold>
					<Color green>{gsis.length} GSI</Color>
				</Text>
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Ixes data={lsis} color="yellow" />
			</Box>

			<Box marginTop={1} flexDirection="column">
				<Ixes data={gsis} color="green" />
			</Box>
		</Box>
	);
});

TableDetails.propTypes = {
	data: T.object.isRequired
};

const TableDescription = memo(({name}) => {
	const {
		loading,
		error,
		data
	} = useDynamo(`describe-table --table-name=${name}`, [name], {skip: !name});

	const table = data && data.Table;

	return (
		<Box>
			{loading ? (
				<Spinner type="bouncingBar" />
			) : error ? (
				<Text>
					<Color redBright>[{error || 'Unknown error'}]</Color>
				</Text>
			) : (
				<TableDetails data={table} />
			)}
		</Box>
	);
});

TableDescription.propTypes = {
	name: T.string.isRequired
};

const App = memo(({filter = ''}) => {
	const {exit} = useApp();
	const {loading, error, data} = useDynamo('list-tables');
	const [table, selectTable] = useState();

	useEffect(() => {
		if (error) {
			setTimeout(exit, 1000);
		}
	}, [error, exit]);

	useInput(input => {
		if (input === 'q') {
			exit();
		}
	});

	const tables =
		data &&
		data.TableNames.filter(label => label.includes(filter)).map(label => ({
			label,
			value: label
		}));

	return (
		<Box flexGrow={1}>
			<Box textWrap="truncate-middle" marginRight={2}>
				{loading ? (
					<Spinner type="bouncingBar" />
				) : error ? (
					<Text>
						<Color redBright>[{error || 'Unknown error'}]</Color>
					</Text>
				) : (
					<SelectInput
						items={tables}
						onSelect={({value}) => selectTable(value)}
					/>
				)}
			</Box>

			<Box flexGrow={1} textWrap="wrap">
				{table ? <TableDescription name={table} /> : null}
			</Box>
		</Box>
	);
});

App.propTypes = {
	filter: T.string
};

module.exports = App;
