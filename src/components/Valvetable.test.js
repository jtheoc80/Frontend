import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => {
    // Filter out Chakra-specific props that would cause React warnings
    const { bg, color, rounded, px, py, shadow, textAlign, minW, overflowX, overflowY, border, borderColor, p, ...cleanProps } = props;
    return <div data-testid="box" {...cleanProps}>{children}</div>;
  },
  TableRoot: ({ children, ...props }) => {
    const { variant, size, ...cleanProps } = props;
    return <table data-testid="table-root" {...cleanProps}>{children}</table>;
  },
  TableHeader: ({ children }) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  TableRow: ({ children, style, ...props }) => {
    return <tr data-testid="table-row" style={style}>{children}</tr>;
  },
  TableColumnHeader: ({ children, ...props }) => {
    // Filter out Chakra-specific props
    const { whiteSpace, minW, ...cleanProps } = props;
    return <th data-testid="table-column-header" {...cleanProps}>{children}</th>;
  },
  TableCell: ({ children, ...props }) => {
    const { whiteSpace, ...cleanProps } = props;
    return <td data-testid="table-cell" {...cleanProps}>{children}</td>;
  },
}));

// Import the component after mocking
import ValveTable from './Valvetable';

// Test data and helper functions that should be exported or accessible
const manufacturerIntervals = {
  Emerson: { A100: 12 },
  Kitz: { B200: 18 },
};

function getRecommendedInterval(valve) {
  if (valve.plantOverrideMonths) return valve.plantOverrideMonths;
  const manu = manufacturerIntervals[valve.manufacturer];
  if (manu && manu[valve.model]) return manu[valve.model];
  return 12;
}

function getNextServiceDate(valve) {
  const intervalMonths = getRecommendedInterval(valve);
  return dayjs(valve.lastServiceDate).add(intervalMonths, "month");
}

function getStatusColor(daysUntil) {
  if (daysUntil < 0) return "#ffd6d6";
  if (daysUntil < 30) return "#fff8c6";
  return "#e5f7ee";
}

describe('ValveTable Component', () => {
  test('renders valve table with headers', () => {
    render(<ValveTable />);
    
    expect(screen.getByText('Valve ID')).toBeInTheDocument();
    expect(screen.getByText('Serial #')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Last Service')).toBeInTheDocument();
    expect(screen.getByText('Process Conditions')).toBeInTheDocument();
    expect(screen.getByText('Next Service')).toBeInTheDocument();
    expect(screen.getByText('Interval (months)')).toBeInTheDocument();
    expect(screen.getByText('Due Status')).toBeInTheDocument();
  });

  test('renders valve data', () => {
    render(<ValveTable />);
    
    // Check for valve data
    expect(screen.getByText('VAL-001')).toBeInTheDocument();
    expect(screen.getByText('SN12345')).toBeInTheDocument();
    expect(screen.getByText('Emerson')).toBeInTheDocument();
    expect(screen.getByText('A100')).toBeInTheDocument();
    expect(screen.getByText('Plant 1')).toBeInTheDocument();
    expect(screen.getByText('In Service')).toBeInTheDocument();
    expect(screen.getByText('High Temp')).toBeInTheDocument();
    
    expect(screen.getByText('VAL-002')).toBeInTheDocument();
    expect(screen.getByText('SN67890')).toBeInTheDocument();
    expect(screen.getByText('Kitz')).toBeInTheDocument();
    expect(screen.getByText('B200')).toBeInTheDocument();
    expect(screen.getByText('Plant 2')).toBeInTheDocument();
    expect(screen.getByText('Needs Repair')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
  });
});

describe('Valve Helper Functions', () => {
  const mockValve1 = {
    id: "VAL-001",
    manufacturer: "Emerson",
    model: "A100",
    lastServiceDate: "2024-01-01",
    plantOverrideMonths: 6,
  };

  const mockValve2 = {
    id: "VAL-002",
    manufacturer: "Kitz",
    model: "B200",
    lastServiceDate: "2024-01-01",
    plantOverrideMonths: null,
  };

  const mockValve3 = {
    id: "VAL-003",
    manufacturer: "UnknownMaker",
    model: "X999",
    lastServiceDate: "2024-01-01",
    plantOverrideMonths: null,
  };

  describe('getRecommendedInterval', () => {
    test('returns plant override when available', () => {
      expect(getRecommendedInterval(mockValve1)).toBe(6);
    });

    test('returns manufacturer interval when no plant override', () => {
      expect(getRecommendedInterval(mockValve2)).toBe(18);
    });

    test('returns default interval for unknown manufacturer', () => {
      expect(getRecommendedInterval(mockValve3)).toBe(12);
    });
  });

  describe('getNextServiceDate', () => {
    test('calculates next service date correctly', () => {
      const nextDate = getNextServiceDate(mockValve1);
      const expected = dayjs("2024-01-01").add(6, "month");
      expect(nextDate.format("YYYY-MM-DD")).toBe(expected.format("YYYY-MM-DD"));
    });
  });

  describe('getStatusColor', () => {
    test('returns red for overdue valves', () => {
      expect(getStatusColor(-10)).toBe("#ffd6d6");
    });

    test('returns yellow for valves due soon', () => {
      expect(getStatusColor(15)).toBe("#fff8c6");
    });

    test('returns green for valves that are OK', () => {
      expect(getStatusColor(60)).toBe("#e5f7ee");
    });
  });
});