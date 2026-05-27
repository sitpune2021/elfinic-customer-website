import React from 'react';
import { SOCIAL_MEDIA_LINKS, CONTACT_INFO, openSocialMediaLink } from '../data/socialMedia';
import SocialMediaIcons from './SocialMediaIcons';

/**
 * Example component showing all ways to use social media links and contact info
 * This component demonstrates various patterns for displaying social media links throughout your project
 */
function SocialMediaExample() {
    return (
        <div className="social-media-examples p-4">
            <h1 className="text-2xl font-bold mb-6">Social Media Integration Examples</h1>

            {/* Example 1: Using the Reusable Component */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">1. Using SocialMediaIcons Component (Recommended)</h2>
                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-sm text-gray-600">With label:</p>
                        <SocialMediaIcons showLabel={true} />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-gray-600">Without label:</p>
                        <SocialMediaIcons />
                    </div>
                    <div>
                        <p className="mb-2 text-sm text-gray-600">Large icons:</p>
                        <SocialMediaIcons iconSize="text-3xl" />
                    </div>
                </div>
            </section>

            {/* Example 2: Manual Implementation with Icons */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">2. Manual Implementation (Custom Styling)</h2>
                <div className="flex gap-4">
                    <a
                        href={SOCIAL_MEDIA_LINKS.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_MEDIA_LINKS.instagram.ariaLabel}
                        className="w-10 h-10 flex items-center justify-center bg-pink-600 text-white rounded-full hover:bg-pink-700"
                    >
                        <i className={`ph-fill ${SOCIAL_MEDIA_LINKS.instagram.iconClass}`}></i>
                    </a>
                    <a
                        href={SOCIAL_MEDIA_LINKS.facebook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_MEDIA_LINKS.facebook.ariaLabel}
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        <i className={`ph-fill ${SOCIAL_MEDIA_LINKS.facebook.iconClass}`}></i>
                    </a>
                    <a
                        href={SOCIAL_MEDIA_LINKS.twitter.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_MEDIA_LINKS.twitter.ariaLabel}
                        className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800"
                    >
                        <i className={`ph-fill ${SOCIAL_MEDIA_LINKS.twitter.iconClass}`}></i>
                    </a>
                    <a
                        href={SOCIAL_MEDIA_LINKS.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_MEDIA_LINKS.linkedin.ariaLabel}
                        className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-full hover:bg-blue-800"
                    >
                        <i className={`ph-fill ${SOCIAL_MEDIA_LINKS.linkedin.iconClass}`}></i>
                    </a>
                    <a
                        href={SOCIAL_MEDIA_LINKS.youtube.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_MEDIA_LINKS.youtube.ariaLabel}
                        className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                        <i className={`ph-fill ${SOCIAL_MEDIA_LINKS.youtube.iconClass}`}></i>
                    </a>
                </div>
            </section>

            {/* Example 3: Text Links */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">3. Text Links</h2>
                <div className="space-y-2">
                    {Object.entries(SOCIAL_MEDIA_LINKS).map(([key, social]) => (
                        <div key={key}>
                            <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Follow us on {social.name}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Example 4: Using Helper Function */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">4. Using openSocialMediaLink Helper</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => openSocialMediaLink(SOCIAL_MEDIA_LINKS.instagram.url)}
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Instagram
                    </button>
                    <button
                        onClick={() => openSocialMediaLink(SOCIAL_MEDIA_LINKS.facebook.url)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Facebook
                    </button>
                </div>
            </section>

            {/* Example 5: Contact Information */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">5. Contact Information</h2>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <i className="ph-fill ph-phone text-xl"></i>
                        <a href={`tel:${CONTACT_INFO.phone}`} className="text-blue-600 hover:underline">
                            {CONTACT_INFO.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="ph-fill ph-envelope text-xl"></i>
                        <a href={`mailto:${CONTACT_INFO.email}`} className="text-blue-600 hover:underline">
                            {CONTACT_INFO.email}
                        </a>
                    </div>
                    <div className="flex items-start gap-2">
                        <i className="ph-fill ph-map-pin text-xl mt-1"></i>
                        <span>{CONTACT_INFO.address}</span>
                    </div>
                </div>
            </section>

            {/* Example 6: Loop Through All Social Media */}
            <section className="mb-8 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-3">6. Dynamic List (Loop)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(SOCIAL_MEDIA_LINKS).map(([key, social]) => (
                        <a
                            key={key}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
                        >
                            <i className={`ph-fill ${social.iconClass} text-2xl`} style={{ color: social.color }}></i>
                            <div>
                                <div className="font-semibold">{social.name}</div>
                                <div className="text-sm text-gray-600">Follow us on {social.name}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Code Examples */}
            <section className="p-4 border rounded bg-gray-50">
                <h2 className="text-xl font-semibold mb-3">Code Usage Examples</h2>
                <div className="space-y-4 text-sm">
                    <div>
                        <h3 className="font-semibold mb-1">Import statements:</h3>
                        <pre className="bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
                            {`import { SOCIAL_MEDIA_LINKS, CONTACT_INFO } from '../data/socialMedia';
import SocialMediaIcons from '../Components/SocialMediaIcons';`}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Using the component:</h3>
                        <pre className="bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
                            {`<SocialMediaIcons showLabel={true} iconSize="text-2xl" />`}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Accessing data:</h3>
                        <pre className="bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
                            {`{SOCIAL_MEDIA_LINKS.instagram.url}
{CONTACT_INFO.phone}
{CONTACT_INFO.email}`}
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SocialMediaExample;
