import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { createMockApiClientModule } from './test/mockApiClient';

import App from './app';

vi.mock('@api/apiClient', () => createMockApiClientModule());

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should show the app title (BHCHP) in the component', () => {
    const { getByText } = render(<App />);
    expect(getByText('BHCHP')).toBeTruthy();
  });
});
