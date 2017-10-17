import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Demo } from './_Demo';

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
