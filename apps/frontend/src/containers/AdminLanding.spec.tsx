import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { createMockApiClientModule } from '../test/mockApiClient';
import AdminLanding from './AdminLanding';

vi.mock('@api/apiClient', () => createMockApiClientModule());

describe('AdminLanding dashboard counts', () => {
  it('renders live count values from API hooks in dashboard tiles', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <AdminLanding />
      </ChakraProvider>,
    );

    expect(screen.getByText('Total Applications')).toBeTruthy();
    expect(screen.getByText('Pending Review')).toBeTruthy();

    expect(screen.getByText('298')).toBeTruthy();
    expect(screen.getByText('52')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('102')).toBeTruthy();
  });
});
