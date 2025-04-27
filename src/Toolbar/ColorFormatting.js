import { useState } from 'react';

const ColorFormatting = (props) => {
  const { formatText } = props;
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const handleTextColorChange = (e) => {
    const color = e.target.value;
    setTextColor(color);
    formatText('foreColor', color);
  };

  const handleBgColorChange = (e) => {
    const color = e.target.value;
    setBgColor(color);
    formatText('hiliteColor', color);
  };

  return (
    <div className="toolbar-container color-format">
      <label htmlFor="text-color"> text color</label>
      <div className="text-color-container">
        <span>A</span>
        <input
          id="text-color"
          type="color"
          value={textColor}
          onChange={handleTextColorChange}
          title="Text Color"
          className="color-picker-text"
        />
      </div>

      <label htmlFor="bg-color">bg color</label>
      <div className="text-color-container">
        <span>Bg</span>
        <input
          type="color"
          value={bgColor}
          onChange={handleBgColorChange}
          title="Background Color"
          className="color-picker-bg"
        />
      </div>
    </div>
  );
};

export default ColorFormatting;
