# Strapi CMS Blog with Next.js Frontend

A full-stack blog application built with Strapi CMS (headless CMS) and Next.js frontend.

## 🚀 Features

- **Strapi Backend**: Content management system with articles, authors, categories, and global settings
- **Next.js Frontend**: Modern React frontend with server-side rendering
- **Dynamic Blocks**: Support for rich-text, quotes, media, and slider components
- **Responsive Design**: Mobile-friendly layout with dark mode support
- **Image Optimization**: Automatic image optimization with Next.js Image component

## 📁 Project Structure

```
strapi/
├── my-project/          # Strapi backend
│   ├── src/api/        # API routes and content types
│   ├── config/         # Strapi configuration
│   └── data/           # Seed data and uploads
└── frontend/           # Next.js frontend
    ├── app/            # Next.js app router pages
    ├── components/     # React components
    └── lib/           # API utilities
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Backend (Strapi)

1. Navigate to the Strapi directory:
```bash
cd my-project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, uses defaults):
```bash
cp .env.example .env
```

4. Start Strapi:
```bash
npm run develop
```

The Strapi admin panel will be available at `http://localhost:1337/admin`

### Frontend (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📝 Content Types

- **Article**: Blog posts with title, description, slug, cover image, author, category, and dynamic blocks
- **Author**: Author information with name, email, and avatar
- **Category**: Article categories with name and slug
- **Global**: Site-wide settings (site name, description, SEO)

## 🧩 Block Components

The article content supports dynamic blocks:

- **Rich Text**: Markdown content with headers, lists, links, and formatting
- **Quote**: Styled blockquotes with author attribution
- **Media**: Single image display with caption
- **Slider**: Grid of multiple images

## 🔧 API Configuration

The frontend connects to Strapi via REST API at `http://localhost:1337/api`. The API configuration is in `frontend/lib/api.ts`.

## 🚀 Deployment

### Strapi

1. Build the admin panel:
```bash
cd my-project
npm run build
```

2. Start production server:
```bash
npm start
```

### Next.js

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start production server:
```bash
npm start
```

## 📚 Learn More

- [Strapi Documentation](https://docs.strapi.io)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This project is open source and available under the MIT License.

