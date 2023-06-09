import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ConfirmDialog from '../confirmDialog';

const TEST_ID = 'test-id';
describe('Test confirmDialog', () => {
  test('The ConfirmDialog close and destroy', async () => {
    const CLOSE_FN = jest.fn();
    const BUTTON_OK = 'button-ok';
    const BUTTON_CANCEL = 'button-cancel';
    const cancelButtonProps = {
      'data-testid': BUTTON_CANCEL,
      className: BUTTON_OK,
    };
    const wrapper = render(
      <ConfirmDialog
        cancelButtonProps={cancelButtonProps}
        onCancel={CLOSE_FN}
        close={CLOSE_FN}
        okCancel
        visible
        title="Are you sure you want to permanently delete ?"
        content="This action is irreversible!"
      />
    );
    const component = wrapper.getByTestId(BUTTON_CANCEL);

    fireEvent.click(component);
    expect(CLOSE_FN).toHaveBeenCalled();
  });

  test('The ConfirmDialog actions', async () => {
    const ACTIONS = <a data-testid={TEST_ID}>molecule</a>;
    const wrapper = render(
      <ConfirmDialog
        actions={ACTIONS}
        close={() => {}}
        okCancel
        visible
        title="Are you sure you want to permanently delete ?"
        content="This action is irreversible!"
      />
    );
    const component = wrapper.getByTestId(TEST_ID);

    expect(component).not.toBeNull();
  });
});
