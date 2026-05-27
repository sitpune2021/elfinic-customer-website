// Centralized pricing plans data
export const pricingPlans = [
    {
        id: 1,
        name: "Bronze",
        price: 0,
        currency: "₹",
        period: "",
        duration: "3 months",
        registrationCharges: 0,
        description: "Perfect for beginner in E commerce",
        validityText: "Valid for 3 months",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        features: [
            "Limited Access",
            "Commission Fee 15%",
            "Upload up to 10 Products"
        ],
        buttonText: "Join Now",
        buttonClass: "btn btn-outline-custom",
        cardClass: "pricing-card",
        nameClass: "plan-name",
        isFeatured: false,
        featuresStyle: { fontSize: '16px' },
        iconClass: "ph ph-check text-success",
        commissionRate: 15,
        productLimit: 10,
        settlementDays: 7
    },
    {
        id: 2,
        name: "Gold",
        price: 3500,
        currency: "₹",
        period: "",
        duration: "Until canceled",
        registrationCharges: 75,
        description: "Perfect for the bulk order National and International (Exports)",
        validityText: "Valid until canceled",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        features: [
            "Zero Commission fee",
            "Settlement in 3 Days",
            "Value for Money",
            "Priority Support",
            "Unlimited Access",
            "Unlimited Storage",
            "Upload unlimited Products"
        ],
        buttonText: "Join Now",
        buttonClass: "btn btn-warning-custom",
        cardClass: "pricing-card featured",
        nameClass: "plan-name text-elifnic",
        isFeatured: true,
        popularBadge: "",
        iconClass: "ph ph-check",
        commissionRate: 0,
        productLimit: "unlimited",
        settlementDays: 3
    },
    {
        id: 3,
        name: "Silver",
        price: 1800,
        currency: "₹",
        period: "",
        duration: "1 year",
        registrationCharges: 35,
        description: "Perfect for National Orders",
        validityText: "Valid for one year",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        features: [
            "Commission fee 2% Flat",
            "Priority Support",
            "Upload up to 50 Products",
            "Value for Money",
            "Unlimited Access"
        ],
        buttonText: "Join Now",
        buttonClass: "btn btn-outline-custom",
        cardClass: "pricing-card",
        nameClass: "plan-name",
        isFeatured: false,
        iconClass: "ph ph-check",
        commissionRate: 2,
        productLimit: 50,
        settlementDays: 5
    }
];

// Helper function to get plan by ID
export const getPlanById = (planId) => {
    return pricingPlans.find(plan => plan.id === parseInt(planId));
};

// Helper function to get plan features by ID
export const getPlanFeatures = (planId) => {
    const plan = getPlanById(planId);
    return plan ? plan.features : [];
};