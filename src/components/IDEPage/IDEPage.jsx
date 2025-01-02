import { useEffect, useState } from 'react';
import useAppState from '../../hooks/useAppState';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import './IDEPage.css';

export default function IDEPage() {
  const {
    inMemoryState,
    _setInMemoryState,
    handlePersistState,
  } = useAppState();

  const [activeTab, setActiveTab] = useState('html');
  const [previewKey, setPreviewKey] = useState(0);

  const handleEditorChange = (value) => {
    _setInMemoryState(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  useEffect(() => {
    // add cmd s/ctrl s to save
    window.addEventListener('keydown', (e) => {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handlePersistState();
        // make save button flash
        const saveButton = document.querySelector('.save-button');
        saveButton.classList.add('flash');
        setTimeout(() => saveButton.classList.remove('flash'), 1000);
      }
    });
  }, []);

  const getLanguageExtension = () => {
    switch (activeTab) {
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      case 'js':
        return [javascript({ jsx: true })];
      default:
        return [];
    }
  };

  const handlePersist = () => {
    handlePersistState();
    setPreviewKey(prev => prev + 1);
  };

  const renderPreview = () => {
    const combinedContent = `
      <html>
        <head>
          <style>${inMemoryState.css}</style>
        </head>
        <body>
          ${inMemoryState.html}
          <script>${inMemoryState.js}</script>
        </body>
      </html>
    `;

    return (
      <iframe
        key={previewKey}
        srcDoc={combinedContent}
        title="preview"
        sandbox="allow-scripts"
      />
    );
  };

  return (
    <div className="ide-container">
      <div className="editor-section">
        <div className="editor-header">
          <div className="tab-container">
            <button
              className={`tab ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              index.html
            </button>
            <button
              className={`tab ${activeTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              styles.css
            </button>
            <button
              className={`tab ${activeTab === 'js' ? 'active' : ''}`}
              onClick={() => setActiveTab('js')}
            >
              script.js
            </button>
          </div>
          <button className="save-button" onClick={handlePersist}>
            Save
          </button>
        </div>
        <div className="editor-content">
          <CodeMirror
            value={inMemoryState[activeTab]}
            height="100%"
            theme={vscodeDark}
            extensions={getLanguageExtension()}
            onChange={handleEditorChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>
        <div className="editor-footer">
          <div className="file-info">
            {activeTab}.{activeTab === 'js' ? 'js' : activeTab}
          </div>
          <div className="editor-stats">
            {inMemoryState[activeTab].length} characters
          </div>
        </div>
      </div>
      
      <div className="preview-section">
        <div className="preview-header">
          <span>Preview</span>
          <button 
            className="refresh-button"
            onClick={() => setPreviewKey(prev => prev + 1)}
          >
            Refresh
          </button>
        </div>
        <div className="preview-content">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}