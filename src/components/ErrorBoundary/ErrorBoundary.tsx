import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Heading, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to external service in production
    this.logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error tracking service like Sentry
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
      // Sentry or other logging service would go here
      console.error('Error logged to monitoring service:', {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } else {
      // Development logging
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box 
          minHeight="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack spacing={6} maxWidth="500px" textAlign="center">
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <Heading size="md" mb={2}>
                  Something went wrong
                </Heading>
                <Text fontSize="sm">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </Text>
              </Box>
            </Alert>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                bg="red.50" 
                border="1px solid" 
                borderColor="red.200" 
                borderRadius="md" 
                p={4} 
                maxWidth="100%" 
                overflow="auto"
              >
                <Text fontSize="xs" fontFamily="mono" color="red.700">
                  <strong>Error:</strong> {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text fontSize="xs" fontFamily="mono" color="red.600" mt={2}>
                    <strong>Component Stack:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </Text>
                )}
              </Box>
            )}

            <VStack spacing={3}>
              <Button 
                colorScheme="blue" 
                onClick={this.handleReload}
                size="lg"
              >
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
              >
                Go to Homepage
              </Button>
            </VStack>

            <Text fontSize="sm" color="gray.600">
              If this problem persists, please contact support with the error details above.
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;