# Coding Rules & Best Practices

## 1. Naming Conventions

### 1.1 File & Folder Naming
- **Files**: Use `kebab-case` for all files
  - `user-profile.component.ts`
  - `auth-service.spec.ts`

- **Folders**: Use `kebab-case` for all folders
  - `user-management/`
  - `common-components/`

### 1.2 Class Naming
- Use `PascalCase` for class names
- Appropriate suffixes based on class type:
  - Controllers: `UserController`
  - Services: `AuthService`
  - Entities: `User`, `BlogPost`
  - DTOs: `CreateUserDto`, `UpdatePostDto`
  - Components (React): `BlogCard`, `UserProfile`
  - Guards: `JwtAuthGuard`
  - Interceptors: `LoggingInterceptor`

### 1.3 Function & Method Naming
- Use `camelCase`
- Start with a verb describing the action:
  - `getUserById()`
  - `createBlogPost()`
  - `validateToken()`

### 1.4 Variable Naming
- Use `camelCase`
- Variable names must clearly describe their purpose:
  - `userEmail`, `isAuthenticated`, `blogPostList`

### 1.5 Constant Naming
- Use `SCREAMING_SNAKE_CASE`
- `API_BASE_URL`, `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`

## 2. Code Organization

### 2.1 Import Order
```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { NextPage } from 'next';

// 2. Internal modules (absolute paths)
import { UserService } from '@/services/user.service';
import { BlogCard } from '@/components/blog-card';

// 3. Relative imports
import './styles.css';
import { helper } from '../utils/helper';
```

### 2.2 Function Organization
- A function should do only one thing
- Maximum 20 lines of code per function
- Maximum 3-4 parameters per function
- Use object destructuring for multiple parameters

### 2.3 Error Handling
- Always handle errors explicitly
- Use try-catch blocks
- Log errors with sufficient context
- Return meaningful error messages

## 3. Backend (NestJS) Specific Rules

### 3.1 Module Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   └── user/
├── common/
├── config/
└── database/
```

### 3.2 Controller Rules
- An endpoint should have only one responsibility
- Use appropriate HTTP status codes
- Validate input data with DTOs
- Document APIs with Swagger decorators

### 3.3 Service Rules
- Business logic must be placed in Services
- Inject dependencies through constructor
- Use async/await instead of Promises

### 3.4 Database Rules
- Use TypeORM entities
- Define relationships clearly
- Implement soft delete for important data
- Use transactions for complex operations

## 4. Frontend (NextJS) Specific Rules

### 4.1 Component Structure
- Functional components with React Hooks
- One component per file
- Props interface clearly defined
- Use TypeScript for type safety

### 4.2 State Management
- Use React hooks for local state
- Implement global state when necessary (Zustand/Redux)
- Avoid prop drilling

### 4.3 Styling Rules
- Use CSS Modules or Styled Components
- Follow mobile-first approach
- Implement responsive design
- Consistent spacing and typography

## 5. Testing Rules

### 5.1 Test File Naming
- Unit tests: `*.spec.ts`
- Integration tests: `*.test.ts`
- E2E tests: `*.e2e-spec.ts`

### 5.2 Test Structure
- Arrange, Act, Assert pattern
- Descriptive test names
- Test both happy path and edge cases
- Minimum 80% code coverage

## 6. Git Rules

### 6.1 Commit Messages
```
type(scope): description

feat(auth): add JWT authentication
fix(user): resolve email validation issue
docs(readme): update installation guide
refactor(api): optimize database queries
```

### 6.2 Branch Naming
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/critical-fix`
- `chore/maintenance-task`

## 7. Documentation Rules

- README.md for each major module
- Code comments for complex logic
- API documentation with Swagger
- Component documentation with Storybook (if applicable)

## 8. Data Format Rules

### 8.1 API Data Exchange Format
- **Frontend to Backend**: All data sent from frontend to backend MUST use `snake_case` format
- **Backend to Frontend**: All data returned from backend to frontend MUST use `snake_case` format

### 8.2 Frontend-Backend Communication Examples

#### ✅ Correct Format
```typescript
// Frontend sending data to backend
const bannerData = {
  title: "Sample Banner",
  link_url: "https://example.com",
  sort_order: 1,
  status: 1
};

// Backend DTO
export class CreateBannerDto {
  @IsString()
  title: string;

  @IsUrl()
  link_url: string;

  @IsInt()
  sort_order: number;

  @IsIn([0, 1])
  status: number;
}

// Backend response
{
  "id": "1",
  "title": "Sample Banner",
  "link_url": "https://example.com",
  "image_url": "/uploads/banner.jpg",
  "sort_order": 1,
  "status": 1,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### ❌ Incorrect Format
```typescript
// Don't use camelCase for API communication
const bannerData = {
  title: "Sample Banner",
  linkUrl: "https://example.com",  // Should be link_url
  sortOrder: 1,                    // Should be sort_order
  status: 1
};
```

### 8.3 Internal Code Conventions
- **Database Fields**: Use `camelCase` (following Prisma convention)
- **Frontend Internal State**: Use `camelCase` for internal component state
- **Backend Internal Variables**: Use `camelCase` for internal variables
- **API DTOs**: Use `snake_case` for all DTO properties

### 8.4 Field Mapping Guidelines
```typescript
// Frontend: Convert between internal camelCase and API snake_case
const internalState = {
  linkUrl: "https://example.com",
  sortOrder: 1
};

// Convert to API format before sending
const apiPayload = {
  link_url: internalState.linkUrl,
  sort_order: internalState.sortOrder
};

// Backend: Convert between API snake_case and database camelCase
const apiData = req.body; // { link_url: "...", sort_order: 1 }
const dbData = {
  linkUrl: apiData.link_url,
  sortOrder: apiData.sort_order
};
```

## 9. Performance Rules

- Lazy loading for components and modules
- Implement caching strategies
- Optimize database queries
- Image optimization
- Code splitting for frontend

## 10. Security Rules

- Validate all inputs
- Implement rate limiting
- Use HTTPS
- Secure sensitive data
- Regular security audits
- Environment variables for sensitive configs
