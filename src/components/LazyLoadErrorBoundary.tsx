import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class LazyLoadErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={6} textAlign="center">
          <VStack spacing={4}>
            <Heading size="md" color="red.500">
              Failed to Load Component
            </Heading>
            <Text color="gray.600">
              There was an error loading this section. This may be due to a network issue.
            </Text>
            {this.state.error && (
              <Text fontSize="sm" color="gray.500" fontFamily="mono">
                {this.state.error.message}
              </Text>
            )}
            <Button 
              onClick={this.handleRetry}
              colorScheme="purple"
              variant="outline"
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;