'use strict';
const React = require('react');
const T = require('prop-types');
const {Text, Color, Box, useInput, useApp} = require('ink');
const Dynamo = require('aws-sdk/clients/dynamodb');
const inkSelectInput = require('ink-select-input');
const inkSpinner = require('ink-spinner');

const {default: SelectInput} = inkSelectInput;
const {default: Spinner} = inkSpinner;
const {useState, useEffect} = React;
const dynamo = new Dynamo({region: 'ap-southeast-2'});

const listTables = () => dynamo.listTables().promise();
const describeTable = name => dynamo.describeTable({TableName: name}).promise();

const TableList = ({onSelect}) => {
	const [{loading, error, tables}, setResult] = useState({loading: true});

	useEffect(() => {
		(async () => {
			try {
				const result = await listTables();
				setResult({
					tables: result.TableNames.map(label => ({label, value: label}))
				});
			} catch (error_) {
				setResult({error: error_});
			}
		})();
	}, []);

	const handleSelect = ({value}) => onSelect(value);

	return loading ? (
		<Spinner type="growVertical" />
	) : error ? (
		<Text>
			<Color redBright>[{error.message || 'Unknown error'}]</Color>
		</Text>
	) : (
		<SelectInput items={tables} onSelect={handleSelect} />
	);
};

TableList.propTypes = {
	onSelect: T.func.isRequired
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

const TableDetails = ({data}) => {
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
				<Text bold>
					<Color yellow>{lsis.length} LSI</Color>
				</Text>
			</Box>
			<Box>
				<Text bold>
					<Color green>{gsis.length} GSI</Color>
				</Text>
			</Box>
			<Box>
				<KeySchema data={data.KeySchema} />
			</Box>

			<Box marginTop={1} flexDirection="column">
				{lsis.map(lsi => {
					return (
						<Box key={lsi.IndexName}>
							<Box marginRight={3}>
								<Text>
									<Color yellow>{lsi.IndexName}</Color>
								</Text>
							</Box>
							<Box>
								<KeySchema data={lsi.KeySchema} />
							</Box>
						</Box>
					);
				})}
			</Box>

			<Box marginTop={1} flexDirection="column">
				{gsis.map(gsi => {
					return (
						<Box key={gsi.IndexName}>
							<Box marginRight={3}>
								<Text>
									<Color green>{gsi.IndexName}</Color>
								</Text>
							</Box>
							<Box>
								<KeySchema data={gsi.KeySchema} />
							</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

TableDetails.propTypes = {
	data: T.object.isRequired
};

const TableDescription = ({name}) => {
	const [{loading, error, table}, setResult] = useState({loading: true});

	useEffect(() => {
		describeTable(name)
			.then(result => setResult({table: result.Table}))
			.catch(error_ => setResult({error: error_}));
	}, [name]);

	return loading ? (
		<Spinner type="growVertical" />
	) : error ? (
		<Text>
			<Color redBright>[{(error && error.message) || 'Unknown error'}]</Color>
		</Text>
	) : (
		<TableDetails data={table} />
	);
};

TableDescription.propTypes = {
	name: T.string.isRequired
};

const App = () => {
	const {exit} = useApp();

	useInput(input => {
		if (input === 'q') {
			exit();
		}
	});

	const [table, selectTable] = useState();
	return (
		<Box flexGrow={1}>
			<Box textWrap="truncate-middle" marginRight={1}>
				<TableList onSelect={selectTable} />
			</Box>
			<Box flexGrow={1} textWrap="wrap">
				<Text>
					{table ? <TableDescription name={table} /> : 'Select a table'}
				</Text>
			</Box>
		</Box>
	);
};

module.exports = App;
