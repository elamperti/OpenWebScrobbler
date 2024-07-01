import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import 'vitest-dom/extend-expect';


afterEach(() => {
  cleanup();
});
