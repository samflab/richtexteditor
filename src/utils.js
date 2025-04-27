// src/utils.js
import { useRef, useEffect } from 'react';

export const useUndoRedo = (editorRef) => {
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const typingTimer = useRef(null);

  const saveState = () => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const lastState = undoStack.current[undoStack.current.length - 1];

    // Save only if content actually changed
    if (!lastState || lastState.html !== currentHtml) {
      undoStack.current.push({
        html: currentHtml,
        selection: getSelectionState(),
      });
      redoStack.current = []; // Clear redo stack on new action
    }
  };

  const getSelectionState = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    return {
      startPath: getNodePath(range.startContainer),
      startOffset: range.startOffset,
      endPath: getNodePath(range.endContainer),
      endOffset: range.endOffset,
    };
  };

  const restoreSelectionState = (selectionState) => {
    if (!selectionState) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.setStart(
      getNodeFromPath(selectionState.startPath),
      selectionState.startOffset
    );
    range.setEnd(
      getNodeFromPath(selectionState.endPath),
      selectionState.endOffset
    );
    selection.addRange(range);
  };

  const getNodePath = (node) => {
    const path = [];
    while (node && node !== editorRef.current) {
      let index = 0;
      let sibling = node;
      while (sibling.previousSibling) {
        sibling = sibling.previousSibling;
        index++;
      }
      path.unshift(index);
      node = node.parentNode;
    }
    return path;
  };

  const getNodeFromPath = (path) => {
    let node = editorRef.current;
    path.forEach((index) => {
      if (node) {
        node = node.childNodes[index];
      }
    });
    return node;
  };

  const handleUndo = () => {
    if (undoStack.current.length <= 1) return; // nothing to undo

    const currentState = undoStack.current.pop(); // remove current
    redoStack.current.push(currentState);

    const previousState = undoStack.current[undoStack.current.length - 1];
    editorRef.current.innerHTML = previousState.html;
    restoreSelectionState(previousState.selection);
  };

  const handleRedo = () => {
    if (redoStack.current.length === 0) return;

    const nextState = redoStack.current.pop();
    undoStack.current.push(nextState);

    editorRef.current.innerHTML = nextState.html;
    restoreSelectionState(nextState.selection);
  };

  const registerTyping = () => {
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      saveState();
    }, 500); // Save after 500ms pause
  };

  // Initial save
  useEffect(() => {
    if (editorRef.current) saveState();
  }, [editorRef]);

  // Save typing automatically
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      registerTyping();
    };

    const handlePasteDrop = () => {
      saveState();
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('paste', handlePasteDrop);
    editor.addEventListener('drop', handlePasteDrop);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('paste', handlePasteDrop);
      editor.removeEventListener('drop', handlePasteDrop);
    };
  }, [editorRef]);

  return {
    handleUndo,
    handleRedo,
    registerTyping,
    saveState,
  };
};

export const cleanHTML = (dirty) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  // Example: Remove all styles, meta, scripts
  const removableTags = ['meta', 'script', 'style', 'link'];
  removableTags.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  });

  // Remove inline styles (optional)
  doc.querySelectorAll('*').forEach((el) => el.removeAttribute('style'));

  return doc.body.innerHTML;
};

export const insertHtmlAtCursor = (html) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const tempEl = document.createElement('div');
  tempEl.innerHTML = html;
  const frag = document.createDocumentFragment();
  let node, lastNode;
  while ((node = tempEl.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  range.insertNode(frag);

  if (lastNode) {
    range.setStartAfter(lastNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
