import { render, screen } from '@testing-library/react';

// Mock Chakra UI components for StatCard
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => {
    // Filter out Chakra-specific props to avoid React warnings
    const { bg, color, rounded, px, py, shadow, textAlign, minW, ...cleanProps } = props;
    return <div data-testid="box" {...cleanProps}>{children}</div>;
  },
  Text: ({ children, ...props }) => {
    const { fontSize, fontWeight, ...cleanProps } = props;
    return <span data-testid="text" {...cleanProps}>{children}</span>;
  },
}));

// Extract StatCard component for testing
function StatCard({ label, value }) {
  const { Box, Text } = require('@chakra-ui/react');
  return (
    <Box
      bg="purple.50"
      color="purple.900"
      rounded="2xl"
      px={6}
      py={4}
      shadow="sm"
      textAlign="center"
      minW="110px"
    >
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
      <Text fontSize="sm">{label}</Text>
    </Box>
  );
}

describe('StatCard Component', () => {
  test('renders with correct label and value', () => {
    render(<StatCard label="Valves" value="250" />);
    
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('Valves')).toBeInTheDocument();
  });

  test('renders with different data', () => {
    render(<StatCard label="In Repair" value="3" />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('In Repair')).toBeInTheDocument();
  });

  test('renders with monetary value', () => {
    render(<StatCard label="Owed" value="$12,500" />);
    
    expect(screen.getByText('$12,500')).toBeInTheDocument();
    expect(screen.getByText('Owed')).toBeInTheDocument();
  });
});
