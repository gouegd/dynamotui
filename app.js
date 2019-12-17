// Rendering a simple centered box
const React = require('react');
const T = require('prop-types');

const api = require('./api');

const {useRef, useEffect, useState} = React;
const {useDynamo} = api;

const App = ({filter: filterBy = ''}) => {
	const listRef = useRef();
	const {loading, error, data} = useDynamo('list-tables');
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
				{` D y n a m o T U I `}
			</box>
			<box
				top="center"
				left="center"
				width="100%"
				height="80%"
				border={{type: 'line'}}
				style={{border: {fg: 'blue'}}}
			>
				{loading
					? 'loading...'
					: error || (
							<list
								ref={listRef}
								keys
								mouse
								items={tables}
								style={{
									item: {fg: 'white'},
									selected: {fg: 'cyan'}
								}}
								onSelect={({content}) => setTable(content)}
							/>
					  )}
			</box>
			<box left="center" bottom={1} shrink>
				{table || 'nothing'}
			</box>
		</element>
	);
};

// Use content or tables[listRef.current.selected]

App.propTypes = {
	filter: T.string
};

module.exports = App;
