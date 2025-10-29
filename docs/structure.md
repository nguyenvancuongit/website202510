# System Structure Documentation

## 1. Project Overview

Blog system is built with microservices architecture using:
- **Backend**: NestJS (Node.js framework)
- **Frontend**: NextJS (React framework)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## 2. Root Directory Structure

```
vian_blog/
├── backend/                 # NestJS Backend Application
├── frontend/               # NextJS Frontend Application
├── docker/                 # Docker configuration files
│   ├── Dockerfile.backend  # Backend Docker configuration
│   └── Dockerfile.frontend # Frontend Docker configuration
├── nginx/                  # Nginx reverse proxy configuration
│   ├── nginx.conf          # Nginx configuration file
│   └── ssl/                # SSL certificates directory
├── docs/                   # Project documentation
│   ├── rule.md             # Coding conventions and best practices
│   └── structure.md        # This file - system structure documentation
├── docker-compose.yml      # Docker services configuration
└── .env.example            # Environment variables template (to be created)
```

## 3. Backend Structure (NestJS)

```
backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/       # Data Transfer Objects
│   │   │   ├── guards/    # Auth guards
│   │   │   └── strategies/ # Passport strategies
│   │   ├── user/          # User management module
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   ├── entities/  # TypeORM entities
│   │   │   └── dto/
│   │   ├── blog/          # Blog posts module
│   │   │   ├── blog.controller.ts
│   │   │   ├── blog.service.ts
│   │   │   ├── blog.module.ts
│   │   │   ├── entities/
│   │   │   └── dto/
│   │   ├── category/      # Blog categories module
│   │   ├── comment/       # Comments module
│   │   └── file/          # File upload module
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── dto/           # Common DTOs
│   │   ├── filters/       # Exception filters
│   │   ├── guards/        # Common guards
│   │   ├── interceptors/  # HTTP interceptors
│   │   ├── interfaces/    # TypeScript interfaces
│   │   ├── pipes/         # Validation pipes
│   │   └── utils/         # Utility functions
│   ├── config/            # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── database/          # Database related
│   │   ├── migrations/    # TypeORM migrations
│   │   ├── seeds/         # Database seeders
│   │   └── database.module.ts
│   ├── app.controller.ts  # Root controller
│   ├── app.service.ts     # Root service
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/                  # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── dist/                  # Compiled JavaScript
├── node_modules/          # Dependencies
├── package.json           # Backend dependencies
├── tsconfig.json          # TypeScript configuration
├── nest-cli.json          # NestJS CLI configuration
├── .env                   # Environment variables
├── .env.example           # Environment template
├── Dockerfile             # Docker configuration
└── README.md              # Backend documentation
```

## 4. Frontend Structure (NextJS)

```
frontend/
├── src/
│   ├── app/               # App Router (NextJS 13+)
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── blog/          # Blog pages
│   │   │   ├── page.tsx   # Blog listing
│   │   │   ├── [slug]/    # Dynamic blog post
│   │   │   └── create/    # Create blog post
│   │   ├── auth/          # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── profile/
│   │   └── admin/         # Admin dashboard
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Basic UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── loader.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── navigation.tsx
│   │   ├── blog/          # Blog-specific components
│   │   │   ├── blog-card.tsx
│   │   │   ├── blog-detail.tsx
│   │   │   ├── blog-form.tsx
│   │   │   └── comment-section.tsx
│   │   └── auth/          # Auth components
│   │       ├── login-form.tsx
│   │       ├── register-form.tsx
│   │       └── profile-form.tsx
│   ├── lib/               # Utility libraries
│   │   ├── api.ts         # API client configuration
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── utils.ts       # General utilities
│   │   └── validations.ts # Form validations
│   ├── hooks/             # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   └── use-local-storage.ts
│   ├── store/             # State management
│   │   ├── auth-store.ts  # Authentication state
│   │   ├── blog-store.ts  # Blog state
│   │   └── ui-store.ts    # UI state
│   ├── types/             # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── blog.types.ts
│   │   └── api.types.ts
│   └── styles/            # Styling
│       ├── globals.css
│       ├── components.css
│       └── pages.css
├── public/                # Static files
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── .next/                 # NextJS build output
├── node_modules/          # Dependencies
├── package.json           # Frontend dependencies
├── next.config.js         # NextJS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── .env.local             # Environment variables
├── .env.example           # Environment template
├── Dockerfile             # Docker configuration
└── README.md              # Frontend documentation
```
