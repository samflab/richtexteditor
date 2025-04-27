import { useRef, useState, useEffect } from 'react';
import './styles/editor.scss';
import TextFormatting from './Toolbar/TextFormatting';
import Indentation from './Toolbar/Identation';
import List from './Toolbar/List';
import InlineElement from './Toolbar/InlineElement';
import BlockElement from './Toolbar/BlockElement';
import HighlightText from './Toolbar/HighlightText';
import ColorFormatting from './Toolbar/ColorFormatting';
import UndoRedo from './Toolbar/UndoRedo';
import { useUndoRedo, cleanHTML, insertHtmlAtCursor } from './utils';
import { sources } from './Toolbar/constants';
import TagMention from './Toolbar/TagMention';

const Editor = () => {
  const editorRef = useRef(null);
  const { registerTyping, saveState, handleUndo, handleRedo } =
    useUndoRedo(editorRef);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionOptions, setMentionOptions] = useState([]);

  const formatText = (command, value = null) => {
    const editor = document.getElementById('editor');
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, value);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '8') {
      e.preventDefault();
      formatText('insertUnorderedList');
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === '7') {
      e.preventDefault();
      formatText('insertOrderedList');
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      formatText('bold');
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      formatText('italic');
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      formatText('underline');
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      handleUndo();
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
    }

    if (e.key === 'Tab') {
      const activeElement = document.activeElement;

      // Check if an inline component is focused
      if (activeElement && activeElement.dataset?.type) {
        e.preventDefault();
        const interactiveElements = document.querySelectorAll('[data-type]');
        if (interactiveElements.length > 0) {
          let index = Array.from(interactiveElements).findIndex(
            (el) => el === activeElement
          );
          index = e.shiftKey ? index - 1 : index + 1;
          if (index < 0) index = interactiveElements.length - 1;
          if (index >= interactiveElements.length) index = 0;
          interactiveElements[index].focus();
        }
      } else {
        // Otherwise, default to indentation inside list
        e.preventDefault();
        if (e.shiftKey) {
          formatText('outdent');
        } else {
          formatText('indent');
        }
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedEl = editorRef.current.querySelector(`[data-id="${id}"]`);
    if (draggedEl) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const parent = range.startContainer;

        if (
          parent &&
          parent.nodeType === Node.ELEMENT_NODE &&
          editorRef.current.contains(parent)
        ) {
          const parentNode = parent.parentNode;
          if (parentNode) {
            parentNode.insertBefore(draggedEl, range.startContainer);
          }
        } else {
          editorRef.current.appendChild(draggedEl);
        }
      } else {
        editorRef.current.appendChild(draggedEl);
      }
    }
  };

  const handleMentionInput = (e) => {
    registerTyping();

    const selection = window.getSelection();
    const node = selection.focusNode;
    if (!node) return;

    const text = node.textContent;
    const cursorPos = selection.focusOffset;
    const textUntilCursor = text.substring(0, cursorPos);

    const atIdx = textUntilCursor.lastIndexOf('@');
    if (atIdx !== -1) {
      const query = textUntilCursor.slice(atIdx + 1);
      setMentionQuery(query);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleMentionSelect = (user) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // First, move range to delete "@mentionQuery" text
    const node = selection.focusNode;
    const offset = selection.focusOffset;

    // Find the start position of the mention query
    let startOffset = offset - mentionQuery.length - 1; // 1 for '@'
    if (startOffset < 0) startOffset = 0;

    const newRange = document.createRange();
    newRange.setStart(node, startOffset);
    newRange.setEnd(node, offset);

    // Delete the "@mentionQuery"
    newRange.deleteContents();

    // Now Insert the Mention Node
    const mentionNode = document.createElement('span');
    mentionNode.textContent = `@${user.name}`;
    mentionNode.className = 'mention-card';
    mentionNode.setAttribute('data-user-id', user.id);
    mentionNode.dataset.userName = user.name;
    mentionNode.dataset.userEmail = user.email;

    range.insertNode(mentionNode);

    const spaceNode = document.createTextNode('\u00A0');
    mentionNode.parentNode.insertBefore(spaceNode, mentionNode.nextSibling);

    const typingNode = document.createTextNode('');
    mentionNode.parentNode.insertBefore(typingNode, spaceNode.nextSibling);

    const cursorRange = document.createRange();
    cursorRange.setStart(typingNode, 0);
    cursorRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(cursorRange);

    setShowMentionDropdown(false);
    setMentionQuery('');
    setMentionOptions([]);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = (e) => {
      if (e.inputType === 'insertText' && e.data === ' ') {
        saveState();
      }
      registerTyping();
    };

    editor.addEventListener('input', handleInput);

    return () => {
      editor.removeEventListener('input', handleInput);
    };
  }, [editorRef]);

  const handlePaste = (e) => {
    e.preventDefault();

    const target = e.target;
    const isCodeZone = target.closest('.code-zone');
    const isCommentZone = target.closest('.comment-zone');

    const clipboardData = e.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const plainText = clipboardData.getData('text/plain');

    if (isCodeZone) {
      insertTextAtCursor(plainText);
      return;
    }

    if (isCommentZone) {
      const cleaned = cleanHTMLMinimal(htmlData || plainText);
      insertHtmlAtCursor(cleaned);
      return;
    }

    if (htmlData) {
      const cleanedHTML = cleanHTML(htmlData);
      insertHtmlAtCursor(cleanedHTML);
    } else if (plainText) {
      insertTextAtCursor(plainText);
    }
  };

  const insertTextAtCursor = (text) => {
    formatText('insertText', false, text);
  };

  return (
    <div
      className="rich-text-editor-container"
      style={{ padding: '20px', fontFamily: 'Arial' }}
    >
      <div className="toolbar-wrapper">
        <TextFormatting formatText={formatText} />
        <ColorFormatting formatText={formatText} />
        <Indentation formatText={formatText} />
        <HighlightText formatText={formatText} />
        <BlockElement setSelectedElement={setSelectedElement} />
        <List formatText={formatText} />
        <InlineElement selectedElement={selectedElement} />
        <UndoRedo editorRef={editorRef} />
      </div>

      <div
        ref={editorRef}
        id="editor"
        className="editor-wrapper"
        contentEditable
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onInput={handleMentionInput}
        onBlur={saveState}
        onClick={(e) => {
          const target = e.target;
          if (target.tagName === 'A') {
            e.preventDefault();
            window.open(target.href, '_blank');
          } else {
            setSelectedElement(null);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        suppressContentEditableWarning={true}
      >
        {showDropdown && (
          <TagMention
            query={mentionQuery}
            handleMentionSelect={handleMentionSelect}
            sources={sources}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
