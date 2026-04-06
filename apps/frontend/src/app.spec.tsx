import { render } from '@testing-library/react';

import App from './app';

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
