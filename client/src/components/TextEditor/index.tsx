import * as React from 'react';
import ContentEditable from 'react-contenteditable';

import './index.less';

interface TextProps {
  ref?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
  placeholder?: string;
  text: string;
  style?: any;
  className?: string;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
  onDoubleClick?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  onChange?(event: any): void;
  onBlur?(event: React.FocusEvent<HTMLDivElement>): void;
}

function pasteOnlyText(event: React.ClipboardEvent<HTMLDivElement>) {
  event.preventDefault();
  event.stopPropagation();
  document.execCommand(
    'insertHTML',
    false,
    event.clipboardData.getData('text/plain'),
  );
}

function TextEditor(props: TextProps, ref: any) {
  const {
    disabled,
    placeholder,
    text,
    style,
    className,
    onKeyDown,
    onDoubleClick,
    onChange,
    onBlur,
  } = props;

  return (
    // @ts-ignore
    <ContentEditable
      innerRef={ref}
      disabled={disabled || false}
      placeholder={placeholder}
      spellCheck={false}
      html={text}
      style={style}
      className={`text-editor${className ? ` ${className}` : ''}`}
      onKeyDown={React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
          event.stopPropagation();
          onKeyDown && onKeyDown(event);
        },
        [onKeyDown],
      )}
      onClick={React.useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          event.stopPropagation(),
        [],
      )}
      onDoubleClick={React.useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation();
          onDoubleClick && onDoubleClick(event);
        },
        [onDoubleClick],
      )}
      onChange={onChange}
      onPaste={pasteOnlyText}
      onBlur={onBlur}
    />
  );
}

export default React.memo(React.forwardRef(TextEditor));
