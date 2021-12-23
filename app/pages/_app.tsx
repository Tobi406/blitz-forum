import { ChakraProvider, Flex } from "@chakra-ui/react";
import LoginForm from "app/auth/components/LoginForm";
import Footer from "app/layout/components/Footer";
import Navigation from "app/layout/components/Navigation";
import PermissionCheck from "app/permissions/components/PermissionCheck";
import {
  AppProps, AuthenticationError,
  AuthorizationError, ErrorBoundary,
  ErrorComponent, ErrorFallbackProps,
  useQueryErrorResetBoundary
} from "blitz";
import React from "react";


export interface PermissionProps {
  permission?: string,
};

interface PermissionPropsApp {
  Component: PermissionProps,
};

export default function App({ Component, pageProps }: AppProps & PermissionPropsApp) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <ChakraProvider>
        <Flex height="100vh" justifyContent="center">
          <Flex height="inherit" width="50%" minWidth="400px" flexDirection="column">
            <Navigation />
            <Flex
              as="main"
            >
              <PermissionCheck permission={Component.permission}>
                {getLayout(<Component {...pageProps} />)}
              </PermissionCheck>
            </Flex>
            <Footer />
          </Flex> 
        </Flex>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
