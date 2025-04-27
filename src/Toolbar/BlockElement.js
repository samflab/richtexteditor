import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faCommentNodes } from '@fortawesome/free-solid-svg-icons';
const BlockElement = (props) => {
  const { setSelectedElement } = props;
  const addCommonEvents = (el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      setSelectedElement?.(el);
    });

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    });
  };
  const insertCustomEditableBlock = (type) => {
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.collapse(false);

    const id = Date.now();
    let wrapper = document.createElement('div');
    wrapper.contentEditable = false; // block itself is not editable
    wrapper.className = `custom-block custom-${type}`;
    wrapper.dataset.id = id;
    wrapper.dataset.type = type;
    
    let editableContent = document.createElement('div');
    editableContent.contentEditable = true; // only inner part editable
    editableContent.className = 'custom-block-content';
    editableContent.innerText =
      type === 'code' ? 'Type code here...' : 'Type quote here...';
    editableContent.addEventListener('click', () => {
      editableContent.innerText = '';
    });
    editableContent.addEventListener('onchange', () => {
      if (
        ((type === 'quote' || type === 'callout') &&
          editableContent.innerText === 'Type quote here...') ||
        (type === 'code' && editableContent.innerText === 'Type code here...')
      ) {
        editableContent.innerText = '';
      }
    });

    wrapper.appendChild(editableContent);

    addCommonEvents(wrapper);

    range.insertNode(wrapper);

    // Move cursor inside the editable content
    const newRange = document.createRange();
    newRange.selectNodeContents(editableContent);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };

  return (
    <div className="toolbar-container custom-inline-dropdown">
      <button
        onClick={() => insertCustomEditableBlock('quote')}
        className="format-btn"
        aria-label="quote button"
        title="Add quote block"
      >
        <FontAwesomeIcon icon={faQuoteLeft} />
      </button>
      <button
        onClick={() => insertCustomEditableBlock('code')}
        className="format-btn"
        aria-label="code button"
        title="Add code block"
      >
        {'</>'}
      </button>
      <button
        onClick={() => insertCustomEditableBlock('callout')}
        className="format-btn"
        aria-label="callout button"
        title="Add callout block"
      >
        <FontAwesomeIcon icon={faCommentNodes} />
      </button>
    </div>
  );
};

export default BlockElement;
