// Social Media Links and Contact Information
export const SOCIAL_MEDIA_LINKS = {
    instagram: {
        url: "https://www.instagram.com/elfinic_com?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        name: "Instagram",
        ariaLabel: "Visit our Instagram page",
        iconClass: "ph-instagram-logo",
        color: "#E4405F"
    },
    facebook: {
        url: "https://www.facebook.com/profile.php?id=61564017328118&rdid=CDd3pKTC4XGJ1wLw&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14PJB63uJNF%2F",
        name: "Facebook",
        ariaLabel: "Visit our Facebook page",
        iconClass: "ph-facebook-logo",
        color: "#1877F2"
    },
    twitter: {
        url: "https://x.com/elfinic_com?t=Ka4SwHxYuq6D6GPyyCsrcA&s=08",
        name: "Twitter/X",
        ariaLabel: "Visit our Twitter page",
        iconClass: "ph-twitter-logo",
        color: "#000000"
    },
    linkedin: {
        url: "https://www.linkedin.com/company/elfinic/",
        name: "LinkedIn",
        ariaLabel: "Visit our LinkedIn page",
        iconClass: "ph-linkedin-logo",
        color: "#0A66C2"
    },
    youtube: {
        url: "https://youtube.com/@elfinic?si=5_ALAv3hvpzZhyce",
        name: "YouTube",
        ariaLabel: "Visit our YouTube channel",
        iconClass: "ph-youtube-logo",
        color: "#FF0000"
    }
};

export const CONTACT_INFO = {
    phone: "+918065912375",
    email: "care@elfinic.com",
    address: "office no 112/B , First Floor, Plot no 11, Gold City Mall, Sector 19D, Vashi ,Navi Mumbai , Maharashtra 400705",
    gstNumber: "27AAJCE2298Q1ZS"
};

// Helper function to open social media links in new tab
export const openSocialMediaLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};
