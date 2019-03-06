import * as React from 'react';

import { LocaleContext } from '$contexts/Locale';

import TextEditor from '$components/TextEditor';

interface TextProps {
  text: string;
  onChange?(event: any): void;
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

export default React.memo(function Text(props: TextProps) {
  const { text, onChange } = props;
  const { locale } = React.useContext(LocaleContext);
  const [contentEditable, setContentEditable] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentEditable) {
      editorRef.current && placeCaretAtEnd(editorRef.current);
    }
  }, [contentEditable]);

  return (
    <TextEditor
      ref={editorRef}
      disabled={!contentEditable}
      placeholder={locale.user.report.textEmptyTips}
      text={text}
      style={contentEditable ? { cursor: 'text' } : undefined}
      onDoubleClick={React.useCallback(() => setContentEditable(true), [])}
      onChange={onChange}
      onBlur={React.useCallback(() => setContentEditable(false), [])}
    />
  );
});
