// React-safe jQuery initialization
// This script prevents jQuery from interfering with React components

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {

        // Override jQuery initialization for React components
        if (window.$ && window.$.fn && window.$.fn.slick) {
            const originalSlick = window.$.fn.slick;

            window.$.fn.slick = function (options) {
                // Check if element has React component marker
                const hasReactComponent = this.is('[data-react-component="true"]') ||
                    this.closest('[data-react-component="true"]').length > 0;

                if (hasReactComponent) {
                    console.log('Preventing jQuery slick initialization on React component:', this);
                    return this; // Return without initializing slick
                }

                // Call original slick for non-React elements
                return originalSlick.call(this, options);
            };
        }

        // Prevent specific product details slider initialization on React components
        const productDetailsThumb = $('.product-details__thumb-slider');
        const productDetailsImages = $('.product-details__images-slider');

        // Only initialize slick on non-React components
        if (productDetailsThumb.length && !productDetailsThumb.attr('data-react-component')) {
            productDetailsThumb.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.product-details__images-slider:not([data-react-component="true"])'
            });
        }

        if (productDetailsImages.length && !productDetailsImages.attr('data-react-component')) {
            productDetailsImages.slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                asNavFor: '.product-details__thumb-slider:not([data-react-component="true"])',
                dots: false,
                arrows: false,
                focusOnSelect: true
            });
        }
    });

    // Additional safety: Monitor for React component additions
    if (window.MutationObserver) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-react-component')) {
                        // Destroy any slick instances on React components
                        if (window.$ && window.$.fn.slick) {
                            $(node).find('.slick-initialized').each(function () {
                                $(this).slick('unslick');
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();