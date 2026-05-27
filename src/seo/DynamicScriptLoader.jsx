import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.elfinic.com/api';
const META_SCRIPT_URL = `${API_BASE_URL}/meta/script1`;

const SCRIPT_CONTENT_KEYS = [
    'script',
    'script_code',
    'script_content',
    'code',
    'content'
];

const SCRIPT_SRC_KEYS = ['src', 'script_url', 'script_src', 'url', 'link'];

function getRouteAliases(pathname) {
    const cleanPath = (pathname || '/').replace(/^\/+|\/+$/g, '');

    if (!cleanPath) {
        return new Set(['home', '/', 'index']);
    }

    const firstSegment = cleanPath.split('/')[0];
    return new Set([
        cleanPath,
        firstSegment,
        cleanPath.replace(/\//g, '_'),
        cleanPath.replace(/-/g, '_')
    ]);
}

function parsePageTargets(pageValue) {
    if (!pageValue) return [];

    return String(pageValue)
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
}

function getScriptDefinitions(item) {
    const definitions = [];

    const isLikelyJavaScript = (value) => {
        return /[;{}]|\b(function|window|document|gtag|dataLayer|fbq)\b/.test(value);
    };

    SCRIPT_SRC_KEYS.forEach((key) => {
        if (typeof item?.[key] === 'string' && item[key].trim()) {
            definitions.push({ type: 'external', src: item[key].trim() });
        }
    });

    SCRIPT_CONTENT_KEYS.forEach((key) => {
        const value = item?.[key];

        if (typeof value !== 'string' || !value.trim()) return;

        const trimmedValue = value.trim();
        if (/^https?:\/\//i.test(trimmedValue) || trimmedValue.startsWith('//')) {
            definitions.push({ type: 'external', src: trimmedValue });
            return;
        }

        if (trimmedValue.includes('<script')) {
            const container = document.createElement('div');
            container.innerHTML = trimmedValue;

            container.querySelectorAll('script').forEach((script) => {
                if (script.src) {
                    definitions.push({ type: 'external', src: script.src });
                } else if (script.textContent?.trim()) {
                    definitions.push({ type: 'inline', code: script.textContent });
                }
            });
            return;
        }

        if (isLikelyJavaScript(trimmedValue)) {
            definitions.push({ type: 'inline', code: trimmedValue });
        }
    });

    return definitions;
}

function DynamicScriptLoader() {
    const location = useLocation();
    const injectedElementsRef = useRef([]);

    useEffect(() => {
        const clearInjectedScripts = () => {
            injectedElementsRef.current.forEach((element) => element.remove());
            injectedElementsRef.current = [];
        };

        const controller = new AbortController();

        const loadScripts = async () => {
            clearInjectedScripts();

            try {
                const response = await fetch(META_SCRIPT_URL, {
                    method: 'GET',
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`Meta script API failed with ${response.status}`);
                }

                const result = await response.json();
                const scripts = Array.isArray(result?.data) ? result.data : [];
                const routeAliases = getRouteAliases(location.pathname);

                const activeScripts = scripts.filter((item) => {
                    const pageTargets = parsePageTargets(item?.pages);
                    if (pageTargets.includes('all_pages')) return true;

                    return pageTargets.some((target) => routeAliases.has(target));
                });

                activeScripts.forEach((item) => {
                    const definitions = getScriptDefinitions(item);

                    definitions.forEach((definition) => {
                        const script = document.createElement('script');
                        script.dataset.metaScriptId = String(item?.id || 'dynamic');

                        if (definition.type === 'external') {
                            script.src = definition.src;
                            script.async = true;
                        } else {
                            script.textContent = definition.code;
                        }

                        document.head.appendChild(script);
                        injectedElementsRef.current.push(script);
                    });
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Dynamic script loading failed:', error);
                }
            }
        };

        loadScripts();

        return () => {
            controller.abort();
            clearInjectedScripts();
        };
    }, [location.pathname]);

    return null;
}

export default DynamicScriptLoader;