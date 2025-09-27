// Example: Adding a new lazy-loaded component to your app
// File: src/examples/NewLazyComponent.example.jsx

import React from 'react';
import { lazyLoad } from '../utils/lazyLoad';
import SuspenseWrapper from '../components/SuspenseWrapper';
import Loading from '../components/Loading';

// Step 1: Create your component (in separate file)
// File: src/pages/NewFeature.jsx
const NewFeature = () => {
    return (
        <div>
            <h1>New Feature Page</h1>
            <p>This component is lazy-loaded!</p>
        </div>
    );
};

// Step 2: Create lazy-loaded version in App.jsx
const LazyNewFeature = lazyLoad(() => import('../pages/NewFeature'));

// Step 3: Add to your routes with Suspense boundary
const ExampleRoutes = () => {
    return (
        <Routes>
            {/* Option A: Use existing app-level Suspense */}
            <Route path="/new-feature" element={<LazyNewFeature />} />
            
            {/* Option B: Add specific Suspense boundary with custom loading */}
            <Route 
                path="/new-feature-custom" 
                element={
                    <SuspenseWrapper 
                        fallback={<Loading message="Loading new feature..." />}
                        errorBoundary={true}
                    >
                        <LazyNewFeature />
                    </SuspenseWrapper>
                } 
            />
        </Routes>
    );
};

// Step 4: (Optional) Add to preload strategy
// In utils/lazyLoad.js, modify preloadCriticalRoutes():
export const preloadCriticalRoutes = () => {
    setTimeout(() => {
        preloadRoute(() => import("../pages/Dashboard"));
        preloadRoute(() => import("../pages/leads/LeadsBase"));
        preloadRoute(() => import("../pages/NewFeature")); // Add your component
    }, 2000);
};

// Advanced Example: Conditional lazy loading
const ConditionalLazyComponent = ({ userRole }) => {
    // Different components based on user role
    const AdminPanel = lazyLoad(() => import('../pages/admin/AdminPanel'));
    const UserDashboard = lazyLoad(() => import('../pages/user/UserDashboard'));
    
    const Component = userRole === 'admin' ? AdminPanel : UserDashboard;
    
    return (
        <SuspenseWrapper 
            fallback={<Loading message={`Loading ${userRole} interface...`} />}
        >
            <Component />
        </SuspenseWrapper>
    );
};

// Example: Nested lazy loading with different loading states
const NestedLazyExample = () => {
    const MainPage = lazyLoad(() => import('../pages/MainPage'));
    const SidePanel = lazyLoad(() => import('../components/SidePanel'));
    
    return (
        <div className="layout">
            <SuspenseWrapper fallback={<Loading message="Loading main content..." />}>
                <MainPage />
            </SuspenseWrapper>
            
            <SuspenseWrapper 
                fallback={<Loading size="small" message="Loading sidebar..." />}
            >
                <SidePanel />
            </SuspenseWrapper>
        </div>
    );
};

// Example: Preload on user interaction
const PreloadOnHover = () => {
    const handleMouseEnter = () => {
        // Preload component when user hovers over link
        import('../pages/HeavyComponent').catch(console.error);
    };
    
    return (
        <nav>
            <Link 
                to="/heavy-component" 
                onMouseEnter={handleMouseEnter}
            >
                Heavy Component (preloads on hover)
            </Link>
        </nav>
    );
};

export {
    LazyNewFeature,
    ConditionalLazyComponent,
    NestedLazyExample,
    PreloadOnHover
}; 