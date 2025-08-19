# Symphony Layers Interactive Explorer - Static Website

This directory contains the static website version of the Symphony Layers Interactive Explorer, designed to be hosted on GitHub Pages.

## Features

- **Interactive Symphony Wheels**: Clickable donut charts for exploring Ecosystem and Pressure layers
- **Layer Details**: Comprehensive information about each Symphony layer including valuability and data availability indexes
- **Parameter Exploration**: Browse related parameters and reference parameters with availability metrics
- **Dataset Discovery**: Search and explore datasets in the catalogue with filtering capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Fast Loading**: Client-side only application with optimized JSON data loading

## Structure

```
docs/
├── index.html              # Main application page
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── app.js             # Main application logic
│   ├── charts.js          # Chart visualization system
│   └── data-loader.js     # JSON data loading and management
├── data/                  # JSON data files
│   ├── catalogue.json
│   ├── symphony_layers.json
│   ├── reference_parameters.json
│   └── recommendation_parameters.json
└── _config.yml            # GitHub Pages configuration
```

## Data Sources

The application uses JSON files generated from the original Excel data:

1. **symphony_layers.json** - Symphony layer information with valuability and availability indexes
2. **reference_parameters.json** - Complete parameter reference with availability metrics
3. **recommendation_parameters.json** - Mapping of layers to related parameter IDs
4. **catalogue.json** - Dataset catalogue with metadata and links

## Deployment

This website is designed to be deployed on GitHub Pages:

1. Enable GitHub Pages in repository settings
2. Set source to "Deploy from a branch"
3. Select the `main` branch and `/docs` folder
4. The site will be available at `https://yourusername.github.io/repository-name/`

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance

- Initial load: ~500KB (including Chart.js CDN)
- JSON data: ~200KB total
- First Contentful Paint: <2s
- Interactive: <3s

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- High contrast support