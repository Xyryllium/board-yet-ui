# Board Yet - Frontend

A **modern React frontend** for Board Yet, a multi-tenant Trello-style project management application. Built with React Router, TypeScript, and Tailwind CSS, featuring real-time collaboration, drag-and-drop functionality, and seamless integration with the Laravel backend.

## Features

### 🔐 **Authentication & Authorization**

- **Secure Login/Signup** with Laravel Sanctum integration
- **Password Reset Flow** with email verification
- **Multi-tenant Authentication** supporting organization subdomains
- **Persistent Sessions** with cross-subdomain cookie support

### 🏢 **Multi-Tenant Organizations**

- **Organization Management** - Create and join organizations
- **Subdomain-based Tenancy** (e.g., `stark.localhost:5173`)
- **Member Invitations** with secure token-based system
- **Role-based Access Control** (Admin, Member)

### 📋 **Project Management (Trello-style)**

- **Drag & Drop Boards** with smooth animations
- **Column Management** - Create, reorder, and delete columns
- **Task Cards** - Full CRUD operations with inline editing
- **Real-time Collaboration** - Live updates across team members
- **Progress Tracking** - Visual indicators and statistics

### 🎨 **Modern UI/UX**

- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - System preference detection
- **Accessibility** - WCAG compliant components
- **Smooth Animations** - Framer Motion integration
- **Custom Scrollbars** - Styled for better UX

### 📱 **User Experience**

- **Modal-based Legal Documents** - Terms of Service & Privacy Policy
- **Invitation System** - Manual link entry and email invitations
- **Member Dashboard** - For users without organizations
- **Error Handling** - Comprehensive error states and recovery
- **Loading States** - Skeleton loaders and progress indicators

## Tech Stack

- **Frontend Framework:** React 19 with React Router v7
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom design system
- **State Management:** React Context + Custom Hooks
- **HTTP Client:** Custom Fetch API wrapper with TypeScript
- **Build Tool:** Vite
- **Deployment:** Docker + Nginx

## Project Structure

```
app/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── board/           # Board management components
│   ├── forms/           # Form components
│   ├── legal/           # Legal document modals
│   ├── layout/          # Layout components
│   └── ui/              # Base UI components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── routes/              # Route definitions
└── api/                 # API integration layer
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Backend API** running (see backend README)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Xyryllium/board-yet-ui.git
cd board-yet-ui
```

2. **Install dependencies:**

```bash
npm install
```

3. **Environment Setup:**

```bash
cp .env.example .env
```

Update `.env` with your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Board Yet
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Docker Development

For consistent development environment:

```bash
# Build and start development container
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Building for Production

### Local Build

```bash
npm run build
```

### Docker Production Build

```bash
# Build production image
docker build -f Dockerfile -t board-yet-ui .

# Run production container
docker run -p 3000:3000 board-yet-ui
```

## API Integration

The frontend integrates with the Laravel backend through:

### Authentication Endpoints

- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/auth/me` - Current user data
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset confirmation

### Organization Endpoints

- `POST /api/organizations` - Create organization
- `GET /api/organizations/subdomain/details/{subdomain}` - Get org details
- `POST /api/organizations/{id}/invite` - Invite members
- `POST /api/organizations/invitations/accept` - Accept invitation

### Board Management

- `GET /api/boards` - List user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/{id}` - Get board details
- `POST /api/columns` - Create column
- `POST /api/columns/{id}/cards` - Create task card

## Key Features Implementation

### Multi-Tenant Architecture

```typescript
// Subdomain detection and routing
const getTenantFromHostname = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts.length > 2 ? parts[0] : null;
};

// Organization-based navigation
const redirectToUserOrganization = (subdomain: string, path: string) => {
  const url = `http://${subdomain}.localhost:5173${path}`;
  window.location.href = url;
};
```

### Drag & Drop Implementation

```typescript
// Column reordering with smooth animations
const handleColumnReorder = (draggedId: string, targetId: string) => {
  const newColumns = reorderArray(columns, draggedId, targetId);
  onReorderColumns(boardId, newColumns);
};
```

### Authentication Flow

```typescript
// Cross-subdomain token management
const storeAuthToken = (token: string) => {
  const isLocalhost = window.location.hostname.includes("localhost");
  const domain = isLocalhost ? ".localhost" : ".boardyet.com";

  document.cookie = `board_yet_auth_token=${token}; domain=${domain}; path=/`;
};
```

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests (if configured)
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── components/          # Component tests
├── hooks/              # Hook tests
├── lib/                # Utility tests
└── __mocks__/          # Mock implementations
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Production

```bash
# Build production image
docker build -f Dockerfile -t board-yet-ui .

# Deploy to your platform
docker run -d -p 3000:3000 board-yet-ui
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.boardyet.com
VITE_APP_NAME=Board Yet
VITE_APP_ENV=production
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new components
- Use semantic commit messages
- Ensure responsive design
- Test cross-browser compatibility

## Roadmap

- [ ] **Real-time Collaboration** - WebSocket integration
- [ ] **Advanced Board Features** - Templates, automation
- [ ] **Mobile App** - React Native version
- [ ] **Offline Support** - PWA capabilities
- [ ] **Advanced Analytics** - Usage insights and reporting
- [ ] **Third-party Integrations** - Slack, GitHub, etc.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/Xyryllium/board-yet-ui/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Xyryllium/board-yet-ui/discussions)

---
