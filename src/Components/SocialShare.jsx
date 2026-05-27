import React, { useState } from 'react';

function SocialShare() {
    const [getCopy, setCopy] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2000);
    };

    // Function to share on social media
    const shareOnSocialMedia = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
                break;
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="on-hover-dropdown common-dropdown border-0 inset-inline-start-auto inset-inline-end-0">
            <ul className="flex-align gap-16">
                <li>
                    {/* copy */}
                    <button
                        title='Copy link'
                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                        onClick={handleCopyClick}
                    >
                        <i className={`ph-fill ${getCopy ? "ph-check" : "ph-copy"}`}></i>
                    </button>
                </li>
                <li>
                    <button
                        title="Share on WhatsApp"
                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                        onClick={() => shareOnSocialMedia('whatsapp')}
                    >
                        <i className="ph-fill ph-whatsapp-logo"></i>
                    </button>
                </li>
                <li>
                    <button
                        title="Share on Facebook"
                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                        onClick={() => shareOnSocialMedia('facebook')}
                    >
                        <i className="ph-fill ph-facebook-logo"></i>
                    </button>
                </li>
                <li>
                    <button
                        title="Share on Instagram"
                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                        onClick={() => shareOnSocialMedia('instagram')}
                    >
                        <i className="ph-fill ph-instagram-logo"></i>
                    </button>
                </li>
                <li>
                    <button
                        title="Share on LinkedIn"
                        className="w-44 h-44 flex-center bg-main-100 text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"
                        onClick={() => shareOnSocialMedia('linkedin')}
                    >
                        <i className="ph-fill ph-linkedin-logo"></i>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default SocialShare;