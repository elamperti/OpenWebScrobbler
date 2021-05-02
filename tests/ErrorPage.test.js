import React from 'react';
import renderer from 'react-test-renderer';

import ErrorPage from '../src/component/ErrorPage.js';

describe('<ErrorPage />', () => {
    it('should match the snapshot', () => {
      const component = renderer.create(<ErrorPage />).toJSON();
      expect(component).toMatchSnapshot();
    });
  });