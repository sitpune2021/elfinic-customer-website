# Heading Component

A flexible, responsive heading component for displaying section titles with optional subtitles and view-all links.

## Features

- ✨ **Responsive Design**: Adapts to different screen sizes automatically
- 🎨 **Multiple Sizes**: Small, Medium, and Large variants
- 📍 **Flexible Alignment**: Left, Center, Right, and Space Between options
- 🎭 **Animation Support**: Built-in WOW.js animation support
- 🔗 **Optional Action Button**: Show/hide view-all links with custom text
- 🎯 **Accessibility**: Focus states and high contrast mode support
- 🌙 **Dark Mode**: Automatic dark mode support
- 📱 **Mobile Optimized**: Stack layout on smaller screens

## Props

| Prop          | Type    | Default         | Description                                             |
| ------------- | ------- | --------------- | ------------------------------------------------------- |
| `title`       | string  | "Default Title" | Main heading text                                       |
| `subtitle`    | string  | `undefined`     | Optional subtitle text (appears above title)            |
| `showViewAll` | boolean | `true`          | Whether to show the view-all link                       |
| `viewAllText` | string  | "View All"      | Text for the view-all button                            |
| `viewAllLink` | string  | "#"             | URL for the view-all link                               |
| `alignment`   | string  | "between"       | Layout alignment (`left`, `center`, `right`, `between`) |
| `size`        | string  | "medium"        | Size variant (`small`, `medium`, `large`)               |
| `animated`    | boolean | `false`         | Enable WOW.js animations                                |
| `className`   | string  | ""              | Additional CSS classes                                  |

## Usage Examples

### Basic Usage

```jsx
import Heading from "./Components/Home/Heading";

<Heading title="Featured Products" />;
```

### With Subtitle and Custom Link

```jsx
<Heading
  title="Trending Products"
  subtitle="What's Hot"
  viewAllText="Shop Now"
  viewAllLink="/trending"
/>
```

### Center Aligned Without Action Button

```jsx
<Heading
  title="Customer Reviews"
  subtitle="What They Say"
  alignment="center"
  showViewAll={false}
/>
```

### Large Size with Animation

```jsx
<Heading
  title="New Arrivals"
  subtitle="Fresh Collection"
  size="large"
  animated={true}
  alignment="center"
/>
```

### Small Heading for Sections

```jsx
<Heading
  title="Related Items"
  size="small"
  viewAllText="See More"
  viewAllLink="/related"
/>
```

## Alignment Options

- **`left`**: Content aligned to the left
- **`center`**: Content centered (view-all button hidden by default on mobile)
- **`right`**: Content aligned to the right
- **`between`**: Title on left, view-all on right (default)

## Size Variants

- **`small`**: 1.25rem title, 0.75rem subtitle
- **`medium`**: 1.5rem title, 0.875rem subtitle (default)
- **`large`**: 2rem title, 1rem subtitle

## Responsive Behavior

- **Desktop (1200px+)**: Full layout as configured
- **Tablet (992px-1199px)**: Slightly smaller fonts
- **Mobile (768px-991px)**: Stacks vertically, adjusts alignment
- **Small Mobile (480px-767px)**: Further reduced font sizes
- **Extra Small (< 480px)**: Minimal spacing, compact layout

## Animation Support

When `animated={true}`:

- Main container: `wow fadeInUp`
- Title: `wow fadeInLeft`
- View-all button: `wow fadeInRight`

Requires WOW.js library to be initialized in your app.

## Styling

The component uses CSS custom properties (CSS variables) from your main theme:

- `--heading-font`: Font family for headings
- `--main`: Primary color for links and accents
- `--main-600`, `--main-200`, etc.: Color variations

## Accessibility

- Proper focus states for interactive elements
- High contrast mode support
- Semantic HTML structure
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with CSS custom properties polyfill)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

Add custom styles by passing a `className` prop or by overriding CSS custom properties:

```css
.custom-heading-style {
  background: linear-gradient(45deg, #f0f0f0, #ffffff);
  padding: 20px;
  border-radius: 8px;
}
```
