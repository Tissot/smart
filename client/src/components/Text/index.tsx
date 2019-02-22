import * as React from 'react';

interface TextProps {
  data: string;
}

export default React.memo(function Text(props: TextProps) {
  return <span>{props.data}</span>;
});
