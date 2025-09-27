import { lazy } from 'react';

export const lazyLoad = (importFunc, retries = 3, delay = 1000) => {
    return lazy(() => new Promise((resolve, reject) => {
        const attemptLoad = (attemptsLeft) => {
            importFunc()
                .then(resolve)
                .catch((error) => {
                    if (attemptsLeft === 1) {
                        reject(error);
                        return;
                    }
                    setTimeout(() => attemptLoad(attemptsLeft - 1), delay);
                });
        };
        attemptLoad(retries);
    }));
};

export const preloadRoute = (importFunc) => {
    try {
        importFunc();
    } catch (error) {
        console.error('Preload failed:', error);
    }
};

export const preloadCriticalRoutes = () => {
    setTimeout(() => {
        preloadRoute(() => import("../pages/Tenents/ListTenents"));
        // Add more critical routes as needed
    }, 2000);
}; 