import { useState, useEffect } from 'react';
import { fallbackFonts, fontSizeList, headerList } from './constants';

const TextFormatting = (props) => {
  const { formatText } = props;

  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState('Arial');

  useEffect(() => {
    const loadFonts = async () => {
      if ('queryLocalFonts' in window) {
        try {
          const localFonts = await window.queryLocalFonts();
          const fontNames = localFonts.map((f) => f.fullName);
          const unique = Array.from(new Set(fontNames)).sort();
          setFonts(unique);
        } catch (err) {
          setFonts(fallbackFonts);
        }
      } else {
        setFonts(fallbackFonts);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    formatText('fontName', selectedFont);
  }, [selectedFont]);

  const handleFontChange = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    formatText('fontName', font);
  };

  const handleHeaderChange = (e) => {
    const tag = e.target.value;
    formatText('formatBlock', tag);
  };

  return (
    <div className="toolbar-font toolbar-container">
      <label htmlFor="font style">select style</label>
      <select
        id="font style"
        aria-labelledby="font style"
        className="font-style-dropdown"
        value={selectedFont}
        onChange={handleFontChange}
      >
        <option value="">Font Family</option>
        {fonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      <label htmlFor="font size">select text size</label>
      <select
        id="font size"
        className="font-size-dropdown"
        aria-labelledby="font size"
        onChange={(e) => formatText('fontSize', e.target.value)}
        defaultValue={fontSizeList[2].value}
      >
        {fontSizeList.map((size) => (
          <option value={size.value} key={size.id}>
            {size.text}
          </option>
        ))}
      </select>

      <label htmlFor="select heading">select heading</label>
      <select
        id="select heading"
        aria-labelledby="select heading"
        className="header-dropdown"
        onChange={handleHeaderChange}
        defaultValue={headerList[6].value}
      >
        {headerList.map((header) => (
          <option key={header.id} value={header.value}>
            {header.text}
          </option>
        ))}
      </select>

      <button
        onClick={() => formatText('bold')}
        className="format-btn bold"
        aria-label="bold"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => formatText('italic')}
        className="format-btn italics"
        aria-label="italics"
        title="Italics"
      >
        I
      </button>
      <button
        onClick={() => formatText('underline')}
        className="format-btn underline"
        aria-label="underline"
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() => formatText('strikeThrough')}
        className="format-btn strike"
        aria-label="strike through"
        title="Strike"
      >
        S
      </button>
    </div>
  );
};

export default TextFormatting;
