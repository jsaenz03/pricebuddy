# Clinical Supply Price Comparison Tool

A professional-grade web application for comparing prices of clinical supplies across multiple suppliers. Built with modern web technologies and shadcn/ui components for a premium user experience.

## Features

### 🏥 Clinical Focus
- Specialized for medical and clinical supplies
- Pre-configured categories: PPE, Syringes, Instruments, Pharmaceuticals, Diagnostics
- SKU-based product tracking
- Clinical supply-specific data structure

### 💰 Price Comparison
- Real-time price comparison across multiple suppliers
- Visual highlighting of lowest/highest prices
- Automatic savings calculations
- Price history tracking (ready for implementation)

### 🔍 Smart Scraping (Framework Ready)
- Modular scraping system with supplier-specific configurations
- Support for different search patterns and selectors
- Retry logic and error handling
- Rate limiting and respectful crawling

### 📊 Analytics Dashboard
- Key performance indicators (KPIs)
- Supplier performance metrics
- Cost savings analytics
- Last update timestamps

### 🎨 Modern UI/UX
- Built with shadcn/ui v4 components
- Responsive design for desktop, tablet, and mobile
- Dark/light mode support (ready)
- Professional healthcare industry styling

## Project Structure

```
pricescraper/
├── index.html                     # Standalone HTML version
├── components/
│   └── price-comparison-app.tsx   # React/TypeScript component
├── styles/
│   └── components.css             # Custom styling and animations
├── types/
│   └── index.ts                   # TypeScript type definitions
└── README.md                      # This file
```

## Quick Start

### Option 1: Standalone HTML Version
Simply open `index.html` in your browser. This version includes:
- Complete functionality with vanilla JavaScript
- Tailwind CSS for styling
- Lucide icons
- No build process required

### Option 2: React/TypeScript Integration

1. **Install Dependencies**
```bash
npm install lucide-react @radix-ui/react-dialog @radix-ui/react-select
npm install tailwindcss @types/react @types/node
```

2. **Set up shadcn/ui**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge dialog input label select table skeleton alert
```

3. **Import and Use the Component**
```typescript
import PriceComparisonApp from './components/price-comparison-app'

export default function Page() {
  return <PriceComparisonApp />
}
```

## Core Components

### 1. Product Management
- Add/remove products with name, SKU, and category
- Support for clinical supply categories
- Bulk import functionality (ready for implementation)

### 2. Supplier Management
- Add/remove supplier sources
- Website URL configuration
- Status tracking (active/pending/inactive)
- API credentials storage (secure, ready for implementation)

### 3. Price Comparison Table
- Dynamic table with supplier columns
- Visual price highlighting (lowest = green, highest = red)
- Best price identification
- Savings percentage calculation

### 4. Dashboard Statistics
- Total tracked products
- Active supplier count
- Average savings percentage
- Last update timestamp

## Integration Points

### Server-Side Scraping
The frontend is designed to integrate with server-side scraping services:

```javascript
// Example: Update prices from scraping service
window.PriceScraper.updatePrices(productId, supplierId, newPrice)

// Example: Set loading state during scraping
window.PriceScraper.setLoadingState(true)
```

### API Integration
Ready-to-implement API hooks for:
- Product CRUD operations
- Supplier management
- Price data persistence
- Scraping job management
- Export/import functionality

### Database Schema (Recommended)
```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Price entries table
CREATE TABLE price_entries (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  supplier_id INTEGER REFERENCES suppliers(id),
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  availability VARCHAR(20) DEFAULT 'unknown',
  confidence DECIMAL(3,2) DEFAULT 1.0,
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Customization

### Adding New Product Categories
1. Update the `ProductCategory` type in `types/index.ts`
2. Add the category to the form dropdown in `ProductForm` component
3. Update the initial state if needed

### Styling Customization
- Edit `styles/components.css` for custom animations and effects
- Modify Tailwind classes in the React component
- Use CSS custom properties for theme customization

### Adding New Suppliers
The application supports dynamic supplier addition through the UI. For programmatic addition:

```typescript
const newSupplier = {
  name: 'New Medical Supply Co',
  url: 'https://newmedsupply.com',
  status: 'pending' as const
}
// Add through UI or API integration
```

## Scraping Implementation Guidelines

### Respectful Scraping
- Implement rate limiting (recommended: 1-2 seconds between requests)
- Respect robots.txt files
- Use appropriate User-Agent strings
- Handle errors gracefully
- Implement retry logic with exponential backoff

### Example Scraping Configuration
```typescript
const scrapingConfig: ScrapingConfig = {
  supplierId: 1,
  baseUrl: 'https://example-medical-supply.com',
  searchPatterns: {
    productName: '{productName}',
    sku: '{sku}',
  },
  selectors: {
    searchBox: 'input[name="search"]',
    priceElement: '.price-display .amount',
    availabilityElement: '.stock-status',
  },
  requestConfig: {
    userAgent: 'Clinical Supply Price Comparison Tool 1.0',
    delay: 2000, // 2 seconds between requests
    retries: 3
  }
}
```

## Security Considerations

### Data Protection
- Never store API keys in frontend code
- Use environment variables for sensitive configuration
- Implement proper authentication for admin functions
- Sanitize all user inputs
- Use HTTPS for all API communications

### Rate Limiting
- Implement server-side rate limiting for scraping
- Use queues for batch operations
- Monitor and log scraping activity
- Respect supplier terms of service

## Export/Import Features

### Supported Formats
- JSON (full data export)
- CSV (price comparison table)
- Excel/XLSX (formatted reports, ready for implementation)

### Export Data Structure
```json
{
  "metadata": {
    "exportedAt": "2024-01-15T10:30:00Z",
    "version": "1.0",
    "totalProducts": 5,
    "totalSuppliers": 3
  },
  "products": [...],
  "suppliers": [...],
  "priceData": {...}
}
```

## Performance Optimization

### Frontend Optimizations
- Lazy loading for large datasets
- Virtual scrolling for tables (ready for implementation)
- Debounced search and filtering
- Memoized calculations for price comparisons

### Backend Recommendations
- Database indexing on SKU, supplier_id, product_id
- Caching for frequently accessed price data
- Background job processing for scraping
- CDN for static assets

## Accessibility Features

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus indicators
- Semantic HTML structure

### Responsive Design
- Mobile-first approach
- Touch-friendly interface elements
- Optimized for tablets and smartphones
- Consistent experience across devices

## Browser Support

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features with modern browser APIs
- Graceful fallbacks for older browsers

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open browser to localhost:3000

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for version control

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions:
1. Check the existing documentation
2. Search existing issues
3. Create a new issue with detailed description
4. Include browser version and steps to reproduce

---

Built with ❤️ for the healthcare industry. Helping medical professionals save time and money on supply procurement.