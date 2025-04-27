const HighlightText = (props) => {
  const { formatText } = props;
  return (
    <div className="highlight-toolbar">
      <button
        onClick={() => formatText('backColor', 'yellow')}
        className="format-btn highlight-yellow"
        aria-label="yellow highlight"
        title="highlight yellow"
      >
        Highlight Yellow
      </button>

      <button
        onClick={() => formatText('backColor', 'lightpink')}
        className="format-btn highlight-lightpink"
        aria-label="pink highlight"
        title="highlight pink"
      >
        Highlight pink
      </button>
    </div>
  );
};

export default HighlightText;
