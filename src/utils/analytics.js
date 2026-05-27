export const trackPageView = (url) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('config', import.meta.env.VITE_GA_ID, {
        page_path: url,
    });
};

export const trackEvent = (action, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', action, params);
};