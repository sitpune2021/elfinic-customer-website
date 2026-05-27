/* ============================================
   ELFINIC SVG ICON - QUICK REFERENCE
   ============================================ */

/**
 * IMPORT
 */
import SvgIcon from './SvgIcon/SvgIcon';
import SvgIcon from '../SvgIcon/SvgIcon';
import SvgIcon from '../../Components/SvgIcon/SvgIcon';

/**
 * BASIC USAGE
 */
<SvgIcon name="shopping-cart" />
<SvgIcon name="home" size={24} />
<SvgIcon name="wallet" size={20} className="me-2" />

/**
 * ALL AVAILABLE ICONS (27)
 */
const AVAILABLE_ICONS = {
  // User & Profile
  'user-bag': 'Profile, User Account',
  'wallet': 'Wallet, Payment, Balance',
  'wishlist-heart': 'Wishlist, Favorites, Like',
  
  // Shopping & Commerce
  'shopping-cart': 'Cart, Shopping',
  'order-history': 'Orders, History, Purchases',
  'cube': 'Product, Inventory, Box',
  'square-plus': 'Add, Buy Now, Create',
  
  // Navigation
  'home': 'Home, Dashboard',
  'search': 'Search, Find',
  'apps': 'Settings, Applications, Grid',
  'list-tree': 'Lists, Categories, Blog',
  
  // Business & Vendor
  'seller': 'Seller, Vendor, Business',
  'store-alt': 'Store, Location, Address',
  'bank': 'Banking, Payment Gateway',
  'display-chart-up': 'Analytics, Growth, Charts',
  'master-plan-integrate': 'Integration, Planning, Marketing',
  
  // Communication
  'envelope': 'Email, Message, Contact',
  'customer-service': 'Support, Help, Headset',
  'pending': 'Pending, Notifications, Track',
  
  // Security & Verification
  'shield-check': 'Security, Verified, Protection',
  'vote-nay': 'Reject, Negative, Cancel',
  
  // Subscriptions
  'subscription': 'Subscription, Recurring',
  'subscription-plan': 'Plans, Pricing',
  
  // Miscellaneous
  'book-alt': 'Documentation, About, Read',
  'brand-badge': 'Badge, Brand, Certified',
  'add-image': 'Upload, Add Image',
  'tax-alt': 'Tax, Finance, Legal'
};

/**
 * SIZE GUIDELINES
 */
const SIZES = {
  xs: 12,   // Very small icons
  sm: 16,   // Breadcrumbs, inline text
  md: 20,   // Navigation items
  base: 24, // Default, buttons
  lg: 32,   // Feature highlights
  xl: 40,   // Feature cards
  '2xl': 48,// Section headers
  '3xl': 60,// Hero sections
  '4xl': 80 // Empty states
};

/**
 * COMMON PATTERNS
 */

// Navigation Menu Item
<NavLink to="/profile">
  <SvgIcon name="user-bag" size={20} className="me-2" />
  Profile
</NavLink>

// Button with Icon
<button className="btn btn-primary">
  <SvgIcon name="shopping-cart" size={18} className="me-2" />
  Add to Cart
</button>

// Feature Card
<div className="feature-card">
  <SvgIcon name="customer-service" size={40} className="mb-3" />
  <h3>24/7 Support</h3>
</div>

// Empty State
<div className="empty-state text-center">
  <SvgIcon name="shopping-cart" size={80} className="mb-4 text-gray-400" />
  <h3>Your cart is empty</h3>
</div>

// Clickable Icon
<SvgIcon 
  name="search" 
  size={24} 
  onClick={() => handleSearch()}
  style={{ cursor: 'pointer' }}
/>

/**
 * COMPONENT USAGE MAP
 */
const COMPONENT_ICONS = {
  // User Panel
  'Dashboard': 'home',
  'Wallet': 'wallet',
  'Orders': 'order-history',
  'Addresses': 'store-alt',
  'Wishlist': 'wishlist-heart',
  'Rewards': 'shield-check',
  'Profile': 'user-bag',
  'Settings': 'apps',
  'Notifications': 'pending',
  
  // Navigation
  'Business': 'seller',
  'Track Order': 'pending',
  'About': 'book-alt',
  'Contact': 'customer-service',
  'Blog': 'list-tree',
  'Cart': 'shopping-cart',
  
  // Business Features
  'Analytics': 'display-chart-up',
  'Marketing': 'master-plan-integrate',
  'Inventory': 'cube',
  'Support': 'customer-service',
  'Payment': 'bank',
  
  // Contact
  'Phone': 'customer-service',
  'Email': 'envelope',
  'Location': 'store-alt'
};

/**
 * STYLING EXAMPLES
 */

// With Bootstrap/Tailwind classes
<SvgIcon name="wallet" size={20} className="me-2 text-primary" />

// With inline styles
<SvgIcon 
  name="home" 
  size={24}
  style={{ 
    marginRight: '8px',
    opacity: 0.8,
    transition: 'all 0.3s ease'
  }}
/>

// Responsive sizing
<SvgIcon 
  name="shopping-cart" 
  size={window.innerWidth < 768 ? 20 : 24} 
/>

/**
 * CONDITIONAL RENDERING
 */
{isInCart ? (
  <SvgIcon name="shopping-cart" size={20} className="text-success" />
) : (
  <SvgIcon name="square-plus" size={20} className="text-primary" />
)}

/**
 * WITH STATE
 */
const [iconSize, setIconSize] = useState(24);
<SvgIcon name="wallet" size={iconSize} />

/**
 * ERROR HANDLING
 */
// Component handles missing icons automatically
// Shows console warning and hides broken image
<SvgIcon name="non-existent-icon" size={24} />
// ⚠️ Console: "Icon not found: non-existent-icon"

/**
 * PERFORMANCE TIPS
 */

// ✅ Good: Specific size
<SvgIcon name="home" size={24} />

// ❌ Avoid: Dynamic imports in render
{icons.map(icon => <SvgIcon name={icon} />)}

// ✅ Better: Memoize or pre-define
const iconList = useMemo(() => 
  icons.map(icon => <SvgIcon key={icon} name={icon} size={20} />)
, [icons]);

/**
 * ACCESSIBILITY
 */
<SvgIcon 
  name="search" 
  size={24}
  onClick={handleSearch}
  aria-label="Search"
  role="button"
  tabIndex={0}
/>

/**
 * COMMON MISTAKES TO AVOID
 */

// ❌ Wrong: Including .svg extension
<SvgIcon name="home.svg" />

// ✅ Correct: Just the name
<SvgIcon name="home" />

// ❌ Wrong: Using old icon classes
<i className="ph ph-home"></i>

// ✅ Correct: Using SvgIcon
<SvgIcon name="home" size={24} />

/**
 * FILE LOCATIONS
 */
const LOCATIONS = {
  component: 'src/Components/SvgIcon/SvgIcon.jsx',
  styles: 'src/Components/SvgIcon/SvgIcon.css',
  icons: 'public/Elfinic_Icons/*.svg',
  docs: 'ICON_INTEGRATION_GUIDE.md'
};

/**
 * QUICK ICON FINDER
 */
const findIcon = (purpose) => {
  const iconMap = {
    'user profile': 'user-bag',
    'money payment wallet': 'wallet',
    'shopping cart buy': 'shopping-cart',
    'orders history': 'order-history',
    'home dashboard': 'home',
    'search find': 'search',
    'email contact': 'envelope',
    'support help': 'customer-service',
    'location address': 'store-alt',
    'business seller': 'seller',
    'wishlist favorite': 'wishlist-heart',
    'settings config': 'apps',
    'notification alert': 'pending',
    'analytics stats': 'display-chart-up',
    'security verified': 'shield-check',
    'add create': 'square-plus'
  };
  
  return Object.entries(iconMap)
    .find(([keywords]) => keywords.includes(purpose.toLowerCase()))?.[1];
};

// Usage: findIcon('payment') => 'wallet'

/* ============================================
   END OF QUICK REFERENCE
   ============================================ */
