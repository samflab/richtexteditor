import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faListNumeric } from '@fortawesome/free-solid-svg-icons';
const List = (props) => {
  const { formatText } = props;
  return (
    <div className="toolbar-container">
      <button
        onClick={() => formatText('insertUnorderedList')}
        className="format-btn"
        aria-label="bullet list"
        title="Add bullet list"
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        onClick={() => formatText('insertOrderedList')}
        className="format-btn"
        aria-label="numerbered list"
        title="Add numbered list"
      >
        <FontAwesomeIcon icon={faListNumeric} />
      </button>
    </div>
  );
};

export default List;
