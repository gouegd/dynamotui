const React = require('react');
const T = require('prop-types');
const { useDynamo } = require('../api');

const Indexes = ({ data, color, top = 0, nocontent, ...rest }) => {
  if (!data || !data.length) {
    return <text {...rest} top={top} fg={color} content={nocontent} />;
  }

  return data.map((index, ix) => {
    const { IndexName, KeySchema } = index;

    const hash = KeySchema.reduce(
      (acc, _) => acc || (_.KeyType === 'HASH' ? _.AttributeName : acc),
      ''
    );

    const range = KeySchema.reduce(
      (acc, _) => acc || (_.KeyType === 'RANGE' ? _.AttributeName : acc),
      ''
    );

    return (
      <box top={top + ix} key={IndexName}>
        <text {...rest} fg={color} content={IndexName} />
        <text bold right={range.length + 1} content={hash} />
        <text right={0} content={range} />
      </box>
    );
  });
};

const TableDetails = ({ name }) => {
  const {
    loading,
    error,
    data,
  } = useDynamo(`describe-table --table-name=${name}`, [name], { skip: !name });

  if (loading) return '...';
  if (error) return error;

  const table = data && data.Table;

  const {
    LocalSecondaryIndexes: lsis = [],
    GlobalSecondaryIndexes: gsis = [],
  } = table || {};

  return (
    <box>
      <Indexes
        bold
        data={[{ IndexName: name, KeySchema: table.KeySchema }]}
        color="blue"
        nocontent="(no table info)"
      />

      <Indexes top={2} data={lsis} color="yellow" nocontent="(no LSI)" />

      <Indexes
        top={3 + (lsis.length || 1)}
        data={gsis}
        color="green"
        nocontent="(no GSI)"
      />
    </box>
  );
};

TableDetails.propTypes = {
  name: T.string.isRequired,
};

module.exports = TableDetails;
