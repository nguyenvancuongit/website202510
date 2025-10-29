# Xiangdao Career - Development Rules & Standards

> **File**: `DEVELOPMENT_RULES.md`  
> **Project**: 象导生涯 (Xiangdao Career) Website  
> **Tech Stack**: Next.js + NestJS + PostgreSQL  
> **Created**: August 20, 2025

## 🎯 ROLE DEFINITION
**You are a Senior Full-stack Developer with 8+ years of experience**:
- **Frontend**: Next.js 14+, React 18+, TypeScript, Tailwind CSS, React Hook Form
- **Backend**: NestJS, TypeScript, PostgreSQL, Prisma ORM, JWT Authentication
- **Architecture**: Clean Architecture, Domain-Driven Design, Microservices
- **DevOps**: Docker, CI/CD, Cloud deployment (AWS/Vercel)

---

## 🏗️ TECHNICAL ARCHITECTURE

### Frontend Stack (Next.js)
```
Next.js 14+ (App Router)
├── TypeScript (strict mode)
├── Tailwind CSS + shadcn/ui
├── React Hook Form + Zod validation
├── TanStack Query (data fetching)
├── Zustand (state management)
└── Framer Motion (animations)
```

### Backend Stack (NestJS)
```
NestJS Framework
├── TypeScript (strict mode)
├── PostgreSQL + Prisma ORM
├── JWT + Passport.js (authentication)
├── Class Validator + Class Transformer
├── Swagger/OpenAPI documentation
└── Rate limiting + Security middleware
```

### Database Design (PostgreSQL)
```
Core Entities:
├── Users (admin accounts)
├── Banners (hero section management)
├── Articles (content management)
├── Categories (content organization)
├── FriendLinks (partnership links)
├── Inquiries (customer leads)
└── Analytics (tracking data)
```

---

## 📁 PROJECT STRUCTURE

### Frontend Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── news/          # News sections
│   │   ├── platform/      # Product showcase
│   │   └── about/         # Company info
│   ├── admin/             # Admin panel
│   │   ├── dashboard/     # Analytics
│   │   ├── content/       # Content management
│   │   ├── banners/       # Banner management
│   │   ├── customers/     # Customer data
│   │   └── settings/      # System settings
│   └── api/               # API routes (if needed)
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── sections/          # Page sections
├── lib/                   # Utilities
├── hooks/                 # Custom hooks
├── types/                 # TypeScript definitions
└── styles/                # Global styles
```

### Backend Structure
```
src/
├── auth/                  # Authentication module
├── users/                 # User management
├── banners/               # Banner CRUD
├── articles/              # Content management
├── categories/            # Category system
├── friend-links/          # Partnership links
├── inquiries/             # Customer inquiries
├── analytics/             # Tracking & metrics
├── common/                # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Auth guards
│   └── interceptors/      # Response interceptors
└── database/              # Database config & migrations
```

---

## 🎨 DESIGN SYSTEM

### Color Palette
```scss
// Primary Colors (Corporate Blue)
$primary-50: #eff6ff;
$primary-500: #3b82f6;  // Main brand color
$primary-700: #1d4ed8;  // Darker variant
$primary-900: #1e3a8a;  // Darkest

// Neutral Colors
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-500: #6b7280;
$gray-900: #111827;

// Status Colors
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
```

### Typography Scale
```scss
// Headings
h1: 2.25rem (36px) - Hero titles
h2: 1.875rem (30px) - Section titles
h3: 1.5rem (24px) - Subsection titles
h4: 1.25rem (20px) - Card titles

// Body Text
body: 1rem (16px) - Main content
small: 0.875rem (14px) - Secondary text
caption: 0.75rem (12px) - Captions, labels
```

### Component Patterns
- **Cards**: Subtle shadows, rounded corners (8px)
- **Buttons**: Primary (filled), Secondary (outlined), Ghost
- **Forms**: Floating labels, validation states
- **Navigation**: Sticky header, breadcrumbs for admin
- **Loading**: Skeleton screens, spinner for actions

---

## 🔐 SECURITY STANDARDS

### Authentication & Authorization
```typescript
// JWT Strategy
interface JWTPayload {
  sub: string;        // User ID
  email: string;
  role: 'admin' | 'editor';
  iat: number;
  exp: number;
}

// Role-based permissions
enum Permission {
  READ_ANALYTICS = 'read:analytics',
  WRITE_CONTENT = 'write:content',
  MANAGE_USERS = 'manage:users',
  MANAGE_BANNERS = 'manage:banners'
}
```

### Input Validation
- **Frontend**: Zod schemas for form validation
- **Backend**: Class Validator decorators
- **Database**: Prisma schema constraints
- **Sanitization**: DOMPurify for rich text content

### Rate Limiting
```typescript
// Public API endpoints
@Throttle(100, 60) // 100 requests per minute

// Admin endpoints  
@Throttle(500, 60) // 500 requests per minute

// File uploads
@Throttle(10, 60)  // 10 uploads per minute
```

---

## 📊 DATABASE CONVENTIONS

### Naming Conventions
```sql
-- Tables: snake_case, plural
users, articles, friend_links, inquiry_forms

-- Columns: snake_case
created_at, updated_at, is_published, meta_title

-- Indexes: idx_table_column
idx_articles_category_id, idx_users_email

-- Foreign Keys: fk_table_referenced_table
fk_articles_users, fk_inquiries_categories
```

### Common Fields Pattern
```typescript
// Base entity fields
interface BaseEntity {
  id: string;           // UUID primary key
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
  isActive: boolean;    // Soft delete flag
}

// SEO fields pattern
interface SEOFields {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug: string;         // URL-friendly identifier
}
```

---

## 🚀 PERFORMANCE STANDARDS

### Frontend Optimization
- **Images**: Next.js Image component, WebP format, lazy loading
- **Fonts**: Google Fonts with font-display: swap
- **Bundle**: Code splitting by routes, dynamic imports
- **Cache**: Static Generation (SSG) for public pages
- **Analytics**: Web Vitals tracking (CLS, FID, LCP)

### Backend Optimization
- **Database**: Connection pooling, query optimization
- **Caching**: Redis for session management, API responses
- **Pagination**: Cursor-based for large datasets
- **Compression**: Gzip/Brotli for API responses
- **Monitoring**: Request timing, error tracking

### Performance Targets
```
// Lighthouse Scores (Mobile)
Performance: >90
Accessibility: >95
Best Practices: >90
SEO: >95

// Core Web Vitals
LCP: <2.5s
FID: <100ms
CLS: <0.1
```

---

## 🎯 CONTENT MANAGEMENT RULES

### Article System
```typescript
interface Article {
  title: string;              // Required, max 100 chars
  slug: string;               // Auto-generated from title
  excerpt: string;            // Required, max 200 chars
  content: string;            // Rich text HTML
  featuredImage: string;      // Required image URL
  category: Category;         // Required relationship
  tags: string[];            // Optional tags
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;         // Schedule publishing
  viewCount: number;          // Auto-tracked
  isSticky: boolean;          // Pin to top
}
```

### SEO Best Practices
- **URLs**: Clean, descriptive slugs (news/industry-trends-2024)
- **Meta**: Unique titles/descriptions per page
- **Headings**: Proper H1-H6 hierarchy
- **Images**: Alt text, descriptive filenames
- **Schema**: JSON-LD structured data

---

## 🔄 DEVELOPMENT WORKFLOW

### Code Quality Standards
```typescript
// ESLint + Prettier configuration
"rules": {
  "@typescript-eslint/no-unused-vars": "error",
  "@typescript-eslint/explicit-function-return-type": "warn",
  "react-hooks/exhaustive-deps": "error"
}

// Commit message format
feat: add banner management functionality
fix: resolve image upload validation bug
docs: update API documentation
style: format code with prettier
```

### Testing Strategy
```
Frontend:
├── Unit Tests: Jest + React Testing Library
├── Integration Tests: API route testing
└── E2E Tests: Playwright (critical user flows)

Backend:
├── Unit Tests: Jest + Supertest
├── Integration Tests: Database operations
└── API Tests: Swagger/OpenAPI validation
```

### Environment Management
```bash
# Development
DATABASE_URL="postgresql://localhost:5432/xiangdao_dev"
JWT_SECRET="dev-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Production
DATABASE_URL="postgresql://prod-server/xiangdao_prod"
JWT_SECRET="secure-production-secret"
NEXT_PUBLIC_API_URL="https://api.xiangdao.com"
```

---

## 📱 RESPONSIVE DESIGN RULES

### Breakpoint System
```scss
// Mobile First Approach
$mobile: 320px;      // Min mobile size
$tablet: 768px;      // Tablet landscape
$desktop: 1024px;    // Desktop
$wide: 1440px;       // Large screens

// Usage in Tailwind
sm:   640px   // Small devices
md:   768px   // Medium devices  
lg:   1024px  // Large devices
xl:   1280px  // Extra large
2xl:  1536px  // 2X Extra large
```

### Component Responsiveness
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Cards**: 1 column mobile, 2-3 columns tablet, 3-4 desktop
- **Forms**: Full width mobile, max-width desktop
- **Images**: Responsive with proper aspect ratios

---

## 🌍 INTERNATIONALIZATION (i18n)

### Language Support
```typescript
// Supported locales
type Locale = 'vi' | 'zh' | 'en';

// Content structure
interface Content {
  vi: string;    // Vietnamese (primary)
  zh: string;    // Chinese (brand language)
  en?: string;   // English (optional)
}

// Route structure
/vi/news/...     // Vietnamese content
/zh/news/...     // Chinese content
/en/news/...     // English content
```

---

## 🚦 ERROR HANDLING

### Frontend Error Boundaries
```typescript
// Global error boundary for React
// Page-level error boundaries
// Form validation error display
// API error handling with retry logic
```

### Backend Exception Filters
```typescript
// Global exception filter
// Validation exception filter
// Database exception handling
// Custom business logic exceptions
```

---

## 📈 ANALYTICS & MONITORING

### Tracking Requirements
```typescript
// User behavior tracking
interface AnalyticsEvent {
  event: string;           // 'page_view', 'form_submit', 'download'
  page: string;            // Current page path
  userId?: string;         // If authenticated
  metadata: object;        // Additional context
  timestamp: Date;
}

// Business metrics
- Inquiry conversion rate
- Content engagement time
- Popular content categories
- User journey funnel
- Partner referral tracking
```

---

## 🎭 CONTENT STRATEGY

### Content Categories
1. **Industry Hotspots**: Weekly industry news and trends
2. **Xiangdao Dynamics**: Company news, product updates
3. **Knowledge Guide**: In-depth professional articles
4. **Career Express**: Quick tips, short-form content

### Content Standards
- **Quality**: Professional, fact-checked, valuable insights
- **Length**: 800-2000 words for guides, 300-600 for news
- **Media**: Featured image + 2-3 supporting images per article
- **Engagement**: Clear CTAs, related content suggestions

---

## 🔒 ADMIN PANEL SPECIFICATIONS

### User Roles & Permissions
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',    // Full system access
  ADMIN = 'admin',                // Content + customer management  
  EDITOR = 'editor'               // Content management only
}

// Permission matrix
SUPER_ADMIN: All permissions
ADMIN: Content, Banners, Customers, Analytics (read-only)
EDITOR: Content (create, edit own), Analytics (read-only)
```

### Dashboard KPIs
- **Traffic**: Daily/weekly/monthly visitors
- **Engagement**: Avg. session duration, bounce rate
- **Conversion**: Inquiry form submissions, conversion rate
- **Content**: Most popular articles, engagement metrics
- **SEO**: Organic traffic, keyword rankings

---

## 🎨 UI/UX PRINCIPLES

### Design Language
- **Professional**: Clean, minimal, trustworthy appearance
- **Authority**: Showcase expertise through design hierarchy
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-first**: Responsive design priority

### Component Library Standards
```typescript
// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// Color system consistency
primary: Blue scale (brand colors)
secondary: Gray scale (neutral)
accent: Green (success), Yellow (warning), Red (error)
```

---

## 🔄 DEVELOPMENT PROCESS

### Git Workflow
```bash
# Branch naming
main                    # Production branch
develop                 # Development branch
feature/banner-crud     # Feature branches
hotfix/security-patch   # Hotfix branches

# Commit message convention
type(scope): description
feat(admin): add banner management interface
fix(api): resolve article pagination bug
docs(readme): update installation guide
```

### Code Review Checklist
- ✅ TypeScript strict mode compliance
- ✅ Component reusability and composition
- ✅ Error handling and edge cases
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Accessibility standards
- ✅ Test coverage >80%

---

## 📊 SEO OPTIMIZATION RULES

### Technical SEO
```typescript
// Page metadata template
interface PageMeta {
  title: string;              // Max 60 chars
  description: string;        // Max 155 chars
  keywords: string[];         // 5-10 relevant keywords
  ogImage: string;           // 1200x630px
  canonicalUrl: string;      // Prevent duplicate content
}

// URL structure
/                          # Homepage
/news                      # News listing
/news/[category]           # Category pages
/news/[category]/[slug]    # Article pages
/platform                 # Product showcase
/about                     # Company info
```

### Content SEO
- **Keyword Strategy**: Focus on career consulting, education technology
- **Internal Linking**: Cross-link related articles
- **Image Optimization**: Compressed, descriptive filenames
- **Site Speed**: <3s load time target
- **Mobile Experience**: Smooth responsive design

---

## 🚀 DEPLOYMENT & MONITORING

### Environment Setup
```bash
# Development
npm run dev              # Next.js dev server
npm run start:dev        # NestJS dev mode

# Production
npm run build           # Build optimized bundle
npm run start:prod      # Production server

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed initial data
```

### Monitoring Checklist
- **Uptime**: 99.9% availability target
- **Performance**: API response time <500ms
- **Security**: Regular dependency updates
- **Backup**: Daily automated database backups
- **Logs**: Centralized logging system

---

## 🎯 SUCCESS METRICS

### Business KPIs
- **Lead Generation**: 20% monthly increase in inquiries
- **SEO Performance**: Top 10 ranking for target keywords
- **User Engagement**: 3+ minutes average session duration
- **Content Performance**: 1000+ monthly organic visits
- **Conversion Rate**: 5%+ inquiry-to-customer conversion

### Technical KPIs
- **Load Time**: <3 seconds initial page load
- **Error Rate**: <1% API error rate
- **Security**: Zero critical vulnerabilities
- **Code Quality**: 90%+ test coverage
- **Developer Experience**: <30 minutes local setup time

---

## 📋 PROJECT REQUIREMENTS REFERENCE

### 🎯 Main Purposes

#### Website Frontend:
- **Branding & Marketing**: Introduce "象导生涯" brand by VIAN company
- **Lead Generation**: Attract potential customers through capability showcase
- **Trust Building**: Build credibility through Corporate Honors, Expert Team, Case Studies
- **Information Hub**: Provide industry news and professional knowledge

#### Admin Panel:
- **Content Management**: Manage all website content without technical knowledge
- **Customer Relationship**: Collect and manage customer inquiries
- **Performance Monitoring**: Track website effectiveness and user behavior
- **Brand Control**: Control brand image through banners, content, partnerships

### 🏢 About the Business
**VIAN Company:**
- **Industry**: Education Technology / Career Consulting
- **New Brand**: "象导生涯" (Xiangdao Career - Career Guidance)
- **Target**: B2B clients, educational institutions, career development services

**Target Customers:**
- Educational organizations needing career guidance solutions
- Enterprises needing human resource development consulting
- Students and professionals needing career orientation

### 🌐 Website Frontend (Public)

#### Homepage - Overview Page
- **Hero Banner**: Create first impression, highlight value proposition
- **Product System**: 4 main company products
- **Solutions**: 4 solutions provided to customers
- **Expert Team**: Team of experts (social proof)
- **R&D Capability**: Research capabilities (competitive advantage)
- **Corporate Honors**: Achievements, awards (credibility)
- **Case Studies**: 3-4 successful projects (proof of concept)
- **Latest Updates**: Latest news (content marketing)
- **Contact Form**: Lead capture

#### Popular News - Content Marketing
- **Industry Hotspots**: Education/career industry news
- **Xiangdao Dynamics**: Company news, brand updates
- **Knowledge Guide**: Professional content, thought leadership
- **Career Express**: Short news, frequent updates

#### Educational Affairs Platform - Product Showcase
- Introduction to website/platform systems developed by the company
- Product demo, features

#### About Us - Company Information
- Mission & Vision (company culture)
- Brand Values
- Development History
- Contact Details

### ⚙️ Admin Panel (Private)

#### 1. Dashboard (Data Tracking)
**Purpose**: Monitor website effectiveness, make business decisions
- Website traffic analytics
- User behavior insights
- Content performance metrics
- Lead generation tracking
- ROI measurement for marketing efforts

#### 2. Banner Management
**Purpose**: Control first impression and promotional campaigns
- Manage hero banner images
- A/B testing different messages
- Seasonal/campaign-specific banners
- Link tracking for marketing campaigns

#### 3. Content Management (Column + Editor)
**Purpose**: Maintain thought leadership and SEO ranking
- Create/edit articles for content marketing
- Manage company and industry news
- SEO optimization for organic traffic
- Content calendar management

#### 4. Friend Link Management
**Purpose**: Partnership development and SEO benefits
- Manage partner relationships
- Cross-promotion opportunities
- SEO backlink management
- Industry network building

#### 5. Customer Information
**Purpose**: Lead management and customer acquisition
- Collect inquiries from contact forms
- Lead scoring and qualification
- Follow-up tracking
- Convert leads to customers

### 🎨 Design Philosophy

#### Frontend:
- **Professional & Trustworthy**: Corporate blue, clean layout
- **Authority Building**: Showcase expertise, achievements, case studies
- **User Journey Optimized**: From awareness → interest → inquiry → conversion

#### Admin Panel:
- **Efficiency First**: Minimize clicks, intuitive workflow
- **Non-technical Friendly**: Easy for marketing team to use
- **Data-Driven**: Clear metrics to measure success
- **Security Focused**: Protect company data and customer information

### 🔄 Business Workflow
- **Content Creation**: Admin creates valuable content → SEO traffic
- **Lead Capture**: Visitors read content → submit inquiry form
- **Lead Management**: Admin follows up inquiries → convert to customers
- **Performance Optimization**: Analytics data → improve website effectiveness
- **Partnership Building**: Friend links → expand network and referrals

### Success Metrics:
- Increase in qualified inquiries
- Improved search engine rankings
- Higher engagement time on site
- Growth in industry recognition
- Partner referral volume
