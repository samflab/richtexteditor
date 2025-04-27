import { useUndoRedo } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';

const UndoRedo = (props) => {
  const { editorRef } = props;
  const { handleUndo, handleRedo } = useUndoRedo(editorRef);

  return (
    <div className="toolbar-container">
      <button
        className="format-btn"
        onClick={handleUndo}
        aria-label="undo"
        title="Undo"
      >
        <FontAwesomeIcon icon={faUndo} />
      </button>
      <button
        className="format-btn"
        onClick={handleRedo}
        aria-label="redo"
        title="Redo"
      >
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
  );
};

export default UndoRedo;
