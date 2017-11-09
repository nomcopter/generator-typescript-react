import * as React from 'react';
import { PACKAGE_NAME } from '../src/index';

export class Demo extends React.PureComponent {
  render() {
    return (
        <h1>{ PACKAGE_NAME }</h1>
    );
  }
}
