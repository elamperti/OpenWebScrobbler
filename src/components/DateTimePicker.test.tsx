import { render } from '@testing-library/react';
import DateTimePicker from './DateTimePicker';
import i18n from '../utils/i18n';

const use12Hours = false;
vi.mock('hooks/useSettings', async () => ({
  ...(await vi.importActual('hooks/useSettings')),
  useSettings: () => ({ settings: { use12Hours } }),
}));

describe('DateTime Picker', () => {
  beforeEach(() => {
    i18n.init();
  });

  it('renders correctly', () => {
    const dummyDate = new Date();
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} value={dummyDate} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  // ToDo: test date/time changes? Maybe with Cypress is easier
});
