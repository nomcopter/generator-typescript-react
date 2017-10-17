import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import '../styles/index.less';

import { Demo } from './Demo';
import './demo.less';

const APP_ELEMENT = document.getElementById('app')!;
const render = (Component: React.ComponentClass<any>) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    APP_ELEMENT,
  );
};

render(Demo);

declare var module: any;
if (module.hot) {
  module.hot.accept('./Demo', () => {
    render(require('./Demo').Demo);
  });
}
