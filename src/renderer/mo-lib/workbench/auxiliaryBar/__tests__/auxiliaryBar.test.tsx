import React from 'react';
import { render } from '@testing-library/react';
import { AuxiliaryModel } from '@/model';
import AuxiliaryBar from '../auxiliaryBar';

const props = new AuxiliaryModel();

describe('The Auxiliary Bar Component', () => {
  test('Should match snapshot', () => {
    expect(render(<AuxiliaryBar {...props} />).asFragment()).toMatchSnapshot();
  });
});
