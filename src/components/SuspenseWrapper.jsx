import React, { Suspense } from 'react';
import Loading from './Loading';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        const handleError = (error) => {
            console.error('Error caught by boundary:', error);
            setHasError(true);
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return (
            <div className="error-boundary">
                <h3>Something went wrong</h3>
                <button onClick={() => window.location.reload()}>
                    Refresh Page
                </button>
            </div>
        );
    }

    return children;
};

const SuspenseWrapper = ({ 
    children, 
    fallback = <Loading message="Loading..." />,
    errorBoundary = true 
}) => {
    const content = (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );

    return errorBoundary ? (
        <ErrorBoundary>{content}</ErrorBoundary>
    ) : (
        content
    );
};

export default SuspenseWrapper; 