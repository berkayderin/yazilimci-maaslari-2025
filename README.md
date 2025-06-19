# Software Developer Salaries 2025

Comprehensive analysis and visualization of software developer salaries in Turkey. This project provides salary trends, position-based comparisons, and analysis by experience levels in the software industry.

## Features

-   Position and experience level-based salary filtering
-   Interactive charts and visualizations
-   Analysis by company size, tech stack, and cities
-   Responsive design
-   Real-time data analysis

## Technologies

-   **Frontend**: Next.js 14, React 18, TypeScript
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts
-   **UI Components**: Radix UI
-   **Data**: JSON-based dataset

## Installation

```bash
# Clone the project
git clone https://github.com/berkayderin/yazilimci-maaslari-2025.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

## API Endpoints

-   `GET /api/salary-data` - Returns salary data and basic statistics
-   `GET /api/salary-stats` - Returns general salary statistics
-   `GET /api/salary-stats/tech-stack` - Returns technology-based salary analysis
-   `GET /api/salary-stats/position-experience` - Returns position and experience-based analysis

## Data Source

Data is sourced from the [Önceki Yazılımcı](https://github.com/oncekiyazilimci/2025-yazilim-sektoru-maaslari) community.

## Deployment

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
