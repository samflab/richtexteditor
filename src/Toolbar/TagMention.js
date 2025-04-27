import { useState, useEffect } from 'react';

const TagMention = ({ query, handleMentionSelect, sources }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const fuzzyMatch = (text, query) =>
      text.toLowerCase().includes(query.toLowerCase());

    let allResults = [];
    sources.forEach((source) => {
      const matched = source.data.filter((item) =>
        fuzzyMatch(item.name, query)
      );
      allResults = allResults.concat(
        matched.map((item) => ({ ...item, type: source.type }))
      );
    });

    setResults(allResults);
  }, [query, sources]);

  return (
    <div className="mention-dropdown">
      {results.map((option) => (
        <div
          key={option.id}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMentionSelect(option);
          }}
          className="mention-option"
        >
          {option.name}
        </div>
      ))}
    </div>
  );
};

export default TagMention;
