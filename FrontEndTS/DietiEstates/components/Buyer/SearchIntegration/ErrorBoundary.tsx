import React, { Component, ErrorInfo } from "react";
import { TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <ThemedView className="p-4 rounded-lg bg-red-50 border border-red-200">
          <ThemedView className="flex-row items-center mb-2">
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <ThemedText className="ml-2 text-red-600 font-medium">
              Something went wrong
            </ThemedText>
          </ThemedView>
          <ThemedText className="text-red-500 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </ThemedText>
          <TouchableOpacity
            onPress={this.handleRetry}
            className="bg-red-600 py-2 px-4 rounded-md self-start"
          >
            <ThemedText className="text-white font-medium">Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) => {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};
