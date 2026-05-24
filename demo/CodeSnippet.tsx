import { useState, type FC } from 'react';

interface CodeSnippetProps {
  code: string;
  title?: string;
}

export const CodeSnippet: FC<CodeSnippetProps> = ({ code, title = 'Code' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="code-snippet">
      <button 
        className="code-snippet__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? '▼' : '▶'} {isOpen ? 'Hide' : 'Show'} {title}
      </button>
      {isOpen && (
        <pre className="code-snippet__code">
          <code>{code.trim()}</code>
        </pre>
      )}
    </div>
  );
};

