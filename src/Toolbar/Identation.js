import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from '@fortawesome/free-solid-svg-icons';
const Indentation = (props) => {
  const { formatText } = props;
  return (
    <div className="toolbar-container">
      <button
        onClick={() => formatText('justifyLeft')}
        className="format-btn"
        aria-label="left align"
        title="Left align text"
      >
        <FontAwesomeIcon icon={faAlignLeft} />
      </button>

      <button
        onClick={() => formatText('justifyCenter')}
        className="format-btn"
        aria-label="center align"
        title="Center align text"
      >
        <FontAwesomeIcon icon={faAlignCenter} />
      </button>

      <button
        onClick={() => formatText('justifyRight')}
        className="format-btn"
        aria-label="right align"
        title="Right align text"
      >
        <FontAwesomeIcon icon={faAlignRight} />
      </button>
    </div>
  );
};

export default Indentation;
