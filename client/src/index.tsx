import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

import * as serviceWorker from './serviceWorker';

import './index.less';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
serviceWorker.register();
