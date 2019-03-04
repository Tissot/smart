import * as React from 'react';
import ContentEditable from 'react-contenteditable';

import './index.less';

interface TextProps {
  id: string;
  data: string;
  onInputUpdate(id: string, data: string): void;
}

function placeCaretAtEnd(el: HTMLElement) {
  el.focus();

  if (
    typeof window.getSelection != 'undefined' &&
    typeof document.createRange != 'undefined'
  ) {
    const range = document.createRange();

    range.selectNodeContents(el);
    range.collapse(false);

    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(range);
  } else if (typeof (document.body as any).createTextRange != 'undefined') {
    const textRange = (document.body as any).createTextRange();

    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

function pasteOnlyText(event: React.ClipboardEvent<HTMLDivElement>) {
  event.preventDefault();
  document.execCommand(
    'insertHTML',
    false,
    event.clipboardData.getData('text/plain'),
  );
}

export default React.memo(function Text(props: TextProps) {
  const { id, data, onInputUpdate } = props;
  const [contentEditable, setContentEditable] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentEditable) {
      editorRef.current && placeCaretAtEnd(editorRef.current);
    }
  }, [contentEditable]);

  return (
    // @ts-ignore
    <ContentEditable
      innerRef={editorRef}
      html={data}
      disabled={!contentEditable}
      style={contentEditable ? { cursor: 'text' } : undefined}
      className="text-editor"
      onKeyDown={React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => event.stopPropagation(),
        [],
      )}
      onDoubleClick={React.useCallback(() => setContentEditable(true), [])}
      onChange={React.useCallback(
        (event: any) => onInputUpdate(id, event.target.value),
        [id],
      )}
      onPaste={pasteOnlyText}
      onBlur={React.useCallback(() => setContentEditable(false), [])}
    />
  );
});
