# Vian Blog

A modern blog system built with NestJS backend and NextJS frontend.

## 🚀 Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Frontend**: NextJS (React framework)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx

## 📁 Project Structure

```
vian_blog/
├── backend/                 # NestJS Backend Application
├── frontend/               # NextJS Frontend Application
├── docker/                 # Docker configuration files
├── nginx/                  # Nginx reverse proxy configuration
├── scripts/                # Database and utility scripts
├── docs/                   # Project documentation
└── docker-compose.yml      # Docker services configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Yarn package manager

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://gitlab.techvify.dev/d3/viansite.git
   cd viansite
   ```

2. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Manual Development

1. **Backend Setup**

   ```bash
   cd backend
   yarn install
   yarn start:dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   yarn dev
   ```

## 📚 Documentation

- [Coding Rules & Best Practices](docs/rule.md)
- [System Structure Documentation](docs/structure.md)

## 🐳 Docker Services

- **postgres**: PostgreSQL 15 database
- **backend**: NestJS application (Port 3001)
- **frontend**: NextJS application (Port 3000)
- **nginx**: Reverse proxy (Production mode)

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=vian_blog
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres123

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚀 Production Deployment

1. **Build and run with production profile**

   ```bash
   docker-compose --profile production up -d
   ```

2. **Generate SSL certificates**
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/key.pem \
     -out nginx/ssl/cert.pem \
     -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"
   ```

## 📝 Available Scripts

### Backend

- `yarn start:dev` - Start development server
- `yarn build` - Build for production
- `yarn start:prod` - Start production server

### Frontend

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server

## 🤝 Contributing

1. Follow the coding conventions in [docs/rule.md](docs/rule.md)
2. Create feature branches: `feature/feature-name`
3. Write tests for new features
4. Update documentation as needed

## 📄 License

This project is private and proprietary.
