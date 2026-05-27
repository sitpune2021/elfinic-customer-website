import React from 'react';
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { SOCIAL_MEDIA_LINKS } from '../data/socialMedia';
import './SocialMediaIcons.css';

/**
 * Reusable Social Media Icons Component
 * @param {string} className - Additional CSS classes for styling
 * @param {string} iconSize - Size of icons (text-xl, text-2xl, text-3xl, etc.)
 * @param {boolean} showLabel - Whether to show "Follow Us:" label
 */
function SocialMediaIcons({ className = "", iconSize = "text-xl", showLabel = false }) {
    const socialMediaConfig = [
        {
            key: 'instagram',
            icon: IoLogoInstagram,
            data: SOCIAL_MEDIA_LINKS.instagram
        },
        {
            key: 'facebook',
            icon: FaFacebook,
            data: SOCIAL_MEDIA_LINKS.facebook
        },
        {
            key: 'twitter',
            icon: FaSquareXTwitter,
            data: SOCIAL_MEDIA_LINKS.twitter
        },
        {
            key: 'linkedin',
            icon: FaLinkedin,
            data: SOCIAL_MEDIA_LINKS.linkedin
        },
        {
            key: 'youtube',
            icon: FaYoutube,
            data: SOCIAL_MEDIA_LINKS.youtube
        }
    ];

    return (
        <div className={`social-media-icons ${className}`}>
            {showLabel && <span>Follow Us:</span>}
            {socialMediaConfig.map(({ key, icon: Icon, data }) => (
                <a
                    key={key}
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={data.ariaLabel}
                    title={data.name}
                    className={`social-icon ${iconSize}`}
                >
                    <Icon />
                </a>
            ))}
        </div>
    );
}

export default SocialMediaIcons;
