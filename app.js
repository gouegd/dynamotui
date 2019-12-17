// Rendering a simple centered box
const React = require('react');
const T = require('prop-types');
const importJsx = require('import-jsx');

const api = require('./api');
const TableDetails = importJsx('./compos/TableDetails');

const { useRef, useEffect, useState } = React;
const { useDynamo } = api;

const App = ({ filter: filterBy = '' }) => {
	const listRef = useRef();
	const { loading, error, data } = useDynamo('list-tables');
	const [table, setTable] = useState();

	useEffect(() => {
		if (data && listRef.current) {
			listRef.current.focus();
		}
	}, [data]);

	const tables =
		data && data.TableNames.filter(label => label.includes(filterBy));

	return (
		<element>
			<box left="center" height={3} border="line" shrink>
				{` D y n a m o T u i `}
			</box>
			<box
				bottom={0}
				left={0}
				width="33%"
				height="100%-3"
				border={{ type: 'line' }}
				style={{ border: { fg: 'gray' } }}
			>
				{loading
					? 'loading...'
					: error || (
							<list
								ref={listRef}
								keys
								mouse
								vi
								items={tables}
								style={{
									item: { fg: 'white' },
									selected: { bg: 'blue', fg: 'black' },
								}}
								onSelect={({ content }) => setTable(content)}
							/>
					  )}
			</box>
			<box
				left="33%"
				bottom={0}
				width="67%"
				height="100%-3"
				border={{ type: 'line' }}
				style={{ border: { fg: table ? 'gray' : 'black' } }}
			>
				{table ? <TableDetails name={table} /> : null}
			</box>
		</element>
	);
};

// Use content or tables[listRef.current.selected] ?

App.propTypes = {
	filter: T.string,
};

module.exports = App;
