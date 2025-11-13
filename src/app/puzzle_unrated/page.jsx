import { useState } from "react";
import { PUZZLE_THEMES } from "../utils/puzzleThemes";

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <PuzzleThemeFilter />
    </div>
  );
}

const PuzzleThemeFilter = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input.trim().toLowerCase());
    }
  };

  const addTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const isValidTag = (tag) =>
    PUZZLE_THEMES.map((t) => t.toLowerCase()).includes(tag.toLowerCase());

  const filteredSuggestions = PUZZLE_THEMES.filter(
    (theme) =>
      theme.toLowerCase().includes(input.toLowerCase()) &&
      !selectedTags.includes(theme.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="border rounded-lg p-2 min-h-[100px] relative">
        <TagList
          tags={selectedTags}
          isValidTag={isValidTag}
          onRemoveTag={removeTag}
        />
        <TagInput
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type puzzle themes..."
        />
        {input && (
          <SuggestionsList
            suggestions={filteredSuggestions}
            onSelectSuggestion={(suggestion) =>
              addTag(suggestion.toLowerCase())
            }
          />
        )}
      </div>
    </div>
  );
};

const TagList = ({ tags, isValidTag, onRemoveTag }) => (
  <div className="flex flex-wrap gap-2 mb-2">
    {tags.map((tag) => (
      <Tag
        key={tag}
        tag={tag}
        isValid={isValidTag(tag)}
        onRemove={() => onRemoveTag(tag)}
      />
    ))}
  </div>
);

const Tag = ({ tag, isValid, onRemove }) => (
  <div
    className={`flex items-center px-3 py-1 rounded-full text-sm ${
      isValid
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800 line-through"
    }`}
    title={!isValid ? "Invalid tag" : ""}
    role="listitem"
  >
    {tag}
    <button
      onClick={onRemove}
      className="ml-2 text-xs font-bold hover:text-red-500"
      aria-label={`Remove ${tag}`}
    >
      ×
    </button>
  </div>
);

const TagInput = ({ value, onChange, onKeyDown, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className="w-full p-2 outline-none"
    aria-label="Add puzzle themes"
  />
);

const SuggestionsList = ({ suggestions, onSelectSuggestion }) => (
  <div
    className="absolute mt-1 w-full max-h-60 overflow-auto bg-white border rounded-lg shadow-lg z-10"
    role="listbox"
  >
    {suggestions.map((suggestion) => (
      <div
        key={suggestion}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onSelectSuggestion(suggestion)}
        role="option"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSelectSuggestion(suggestion);
          }
        }}
      >
        {suggestion}
      </div>
    ))}
  </div>
);
