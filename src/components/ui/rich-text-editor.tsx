import React from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={8}
      className="w-full border rounded p-2"
      placeholder="Enter rich text..."
    />
  );
};

export default RichTextEditor;
