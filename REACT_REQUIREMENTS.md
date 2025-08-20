# Symphony Layers Explorer - React Requirements

## Project Overview

The Symphony Layers Explorer is a web application that enables users to explore oceanic Symphony layers, their associated P02 oceanographic parameters, and related datasets. The application provides a three-tiered exploration experience: Layers → Parameters → Datasets.

## Core Functionality Requirements

### 1. Application Architecture

#### 1.1 Main Navigation Flow
- **Layer Discovery**: Browse and search through available Symphony layers
- **Parameter Exploration**: View P02 parameters associated with selected layers  
- **Dataset Analysis**: Explore datasets related to specific P02 parameters
- **Breadcrumb Navigation**: Clear navigation path showing current location and ability to go back

#### 1.2 Data Sources
The application must load and process three primary data files:
- `symphony_layers.json` - Complete layer metadata with P02 parameters, availability indexes, and improvement analysis. The data of all layers should be obtained from this file. 
- `p02_analysis.json` - P02 parameter availability analysis and metadata. Used to provide extra information about the parameters that each layer is related to. 
- `catalogue.json` - Dataset catalogue with P02 parameter mappings. 

## 2. User Interface Components

### 2.1 Header Component
- Application title: "Symphony Layers Explorer"  
- Optional navigation controls
- Consistent across all views

### 2.2 Layer List View (Primary View)

- **Grid/Card Layout**: Display Symphony layers as interactive cards

- **Layer Card Information**:
  - Layer name (formatted title)
  - Symphony theme classification
  - Data availability index (number without decimals)
  - Improvement potential indicator (small/medium/large)
  - Difficulty indicator (low/medium/high)
  - Satellite sensing capability indicator

- **Search and Filter Capabilities**:
  - Real-time text search across layer names and themes
  - Filter by Symphony theme categories
  - Filter by improvement potential levels
  - Filter by difficulty levels
  - Toggle for satellite sensing capability
  - Sort options (name, availability, parameter count, etc.)

- **Interactive Features**:
  - Click layer card to navigate to parameter view
  - Hover effects and visual feedback
  - Loading states during data fetching

### 2.3 Specific Layer View (Secondary View)
- **Breadcrumb Navigation**: "Layers > [Selected Layer Name]"

- **Layer information**:
  - Layer name
  - Summary
  - Lineage
  - Recommendations 
  - Data availbility index
  - Improvement AI analysis
  -   Improvement potential indicator (small/medium/large)
  -   Difficulty indicator (low/medium/high)
  -   Satellite sensing capability indicator
  -   Improvemet reasoning
  - p02 paramters (as a table)
    - each parameter with the indexes in p02_analysis.json

- **Navigation**:
  - Click parameter to view related datasets
  - Back to layers view via breadcrumb

### 2.4 Dataset Table View (Tertiary View)
- **Breadcrumb Navigation**: "Layers > [Layer] > [Parameter preferred label]"
- **Dataset Information Display**:
  - Tabular view of datasets related to selected P02 parameter
  - Dataset columns should include:
    - Dataset name/title
    - Data source/provider
    - Additional metadata fields
    - Link based on the url

- **Dataset Features**:
  - Sortable columns
  - Search/filter within datasets
  - Responsive table design
  - Handle empty states gracefully

## 3. Data Management Requirements

- **Asynchronous Data Fetching**: Load JSON files efficiently with proper error handling
- **Loading States**: Show loading indicators during data fetch operations
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Data Validation**: Validate loaded data structure and content

## 4. User Experience Requirements

### 4.1 Responsive Design
- **Mobile-First Approach**: Application must work on mobile devices
- **Responsive Grid Systems**: Adapt card layouts for different screen sizes
- **Touch-Friendly Interface**: Appropriate touch targets for mobile users

### 4.2 Performance Requirements
- **Fast Initial Load**: Optimize bundle size and loading strategies
- **Smooth Navigation**: Instant transitions between views
- **Efficient Rendering**: Handle large datasets (468 P02 parameters, multiple datasets) without performance degradation
- **Search Performance**: Real-time search results without lag

### 4.3 Accessibility
- **Keyboard Navigation**: Full functionality via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Sufficient contrast ratios for readability
- **Focus Management**: Clear focus indicators and logical tab order

## 5. Technical Requirements

### 5.1 React Implementation Standards
- **Functional Components**: Use React functional components with hooks
- **TypeScript**: Implement TypeScript for type safety (recommended)
- **Component Architecture**: 
  - Reusable, composable components
  - Clear separation of concerns
  - Proper prop typing

### 5.2 State Management
- **React Context**: For global application state (selected layer/parameter, navigation)
- **useState/useEffect**: For component-local state and side effects
- **Custom Hooks**: For reusable logic (data fetching, search, filtering)

### 5.3 Routing
- **Client-Side Routing**: React Router for navigation between views
- **URL State Management**: Reflect current view state in URLs
- **Deep Linking**: Direct links to specific layers/parameters

### 5.4 Styling
- **Tailwind**
- **Responsive CSS Grid/Flexbox**: Modern layout systems
- **Design Consistency**: Maintain visual consistency with current design

## 6. Data Flow Examples

### 6.1 Layer Selection Flow
1. User views layer list with search/filter options
2. User clicks on a layer card (e.g., "Coastal birds")
3. Application navigates to specific layer view
4. The user can read the data related to the layer.

### 6.2 Parameter Selection Flow
1. User clicks on a parameter in the p02 parameters table in th specific layer view
2. Application navigates to dataset view
3. Shows breadcrumb "Layers > Coastal birds > Bird Counts"
4. Displays table of datasets that contain sampling parameter data
5. User can return via breadcrumb navigation

## 7. Error Handling and Edge Cases

### 7.1 Data Loading Errors
- Network failures during JSON loading
- Malformed or missing data files
- Empty datasets or missing relationships

### 7.2 User Input Handling
- Empty search results
- Invalid filter combinations
- Browser back/forward navigation

### 7.3 Missing Data Scenarios
- Layers with no P02 parameters
- Parameters with no associated datasets
- Missing metadata fields

## 8. Performance and Scalability

### 8.1 Current Scale
- **Symphony Layers**: ~100+ layers
- **P02 Parameters**: 468 parameters
- **Datasets**: Variable number per parameter

### 8.2 Optimization Strategies
- **Virtual Scrolling**: For large lists if needed
- **Debounced Search**: Prevent excessive API calls during typing
- **Memoization**: React.memo for expensive components
- **Code Splitting**: Lazy load views/components

## 9. Deployment Requirements

### 9.1 Build Process
- **Static Site Generation**: Must generate static files for GitHub Pages deployment
- **Asset Optimization**: Minified CSS/JS, optimized images
- **Bundle Analysis**: Monitor and optimize bundle size

### 9.2 GitHub Pages Compatibility
- **Static Hosting**: No server-side rendering required
- **Client-Side Routing**: Hash routing or proper fallback handling
- **Asset Paths**: Correct relative paths for subdirectory deployment

## 10. Success Criteria

### 10.1 Functional Success
- All three navigation levels work correctly (Layers → Parameters → Datasets)
- Search and filtering perform as expected
- Data loads and displays accurately
- Navigation breadcrumbs function properly

### 10.2 Technical Success
- Code is maintainable and well-structured
- Performance meets or exceeds current implementation
- Responsive design works across devices
- Accessible to users with disabilities

### 10.3 User Experience Success
- Intuitive navigation flow
- Fast, responsive interface
- Clear visual hierarchy and information architecture
- Graceful error handling and loading states

## Implementation Priority

### Phase 1: Core Infrastructure
- Data loading system
- Basic routing setup
- Main layout components

### Phase 2: Layer List View
- Layer cards with complete information
- Search and filtering functionality
- Navigation to parameter view

### Phase 3: Parameter and Dataset Views
- Parameter list component
- Dataset table component
- Complete navigation flow

### Phase 4: Polish and Optimization
- Responsive design refinements
- Performance optimizations
- Accessibility improvements
- Error handling enhancements