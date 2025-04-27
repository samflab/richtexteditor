import { customElementList } from './constants';
const InlineElement = (props) => {
  const { selectedElement } = props;
  const wrapSelectionWithElement = (type) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const id = Date.now();
    let element;

    if (type === 'link') {
      let url = prompt('Enter the URL:');
      if (!url) return;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      element = document.createElement('a');
      element.href = url;
      element.target = '_blank';
      element.textContent = selectedText;
      element.className = 'inline-link';
      element.dataset.type = 'link';
      element.dataset.id = id;
      element.contentEditable = false;
      element.draggable = true;

      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank');
      });

      element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', element.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
      });
    } else {
      element = document.createElement('span');
      element.textContent = selectedText;
      element.className = `inline-component inline-${type}`;
      element.dataset.type = type;
      element.dataset.id = id;
      element.contentEditable = false;
      element.draggable = true;

      element.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedElement(element);
      });

      element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', element.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
      });
    }

    range.deleteContents();
    range.insertNode(element);
  };

  const moveSelectedElement = (direction) => {
    if (!selectedElement) return;
    const parent = selectedElement.parentNode;
    if (direction === 'left' && selectedElement.previousSibling) {
      parent.insertBefore(selectedElement, selectedElement.previousSibling);
    } else if (direction === 'right' && selectedElement.nextSibling) {
      parent.insertBefore(selectedElement.nextSibling, selectedElement);
    }
  };

  const updateSelectedElement = (newText) => {
    if (selectedElement) {
      selectedElement.textContent = newText;
    }
  };

  return (
    <>
      <div className="toolbar-container custom-inline-dropdown">
        <label htmlFor="custom-element">Custom element</label>
        <select
          id="custom-element"
          aria-labelledby="custom-element"
          onChange={(e) => wrapSelectionWithElement(e.target.value)}
        >
          {customElementList.map((element) => (
            <option value={element.value} key={element.id}>
              {element.text}
            </option>
          ))}
        </select>
      </div>
      {selectedElement && (
        <div
          className="toolbar-container"
          style={{ marginTop: 10, display: 'flex', gap: 5 }}
        >
          <input
            type="text"
            placeholder="Update Text"
            defaultValue={selectedElement.textContent}
            onBlur={(e) => updateSelectedElement(e.target.value)}
          />
          <button onClick={() => moveSelectedElement('left')}>⬅️</button>
          <button onClick={() => moveSelectedElement('right')}>➡️</button>
        </div>
      )}
    </>
  );
};

export default InlineElement;
