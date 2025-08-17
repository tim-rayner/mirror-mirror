# Charlotte's Mirror Mirror - Smart Mirror Controller

A whimsical, fairytale-themed web controller for Magic Mirror 2, communicating with [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) via its REST API.

## ✨ Features

- **Dashboard**: Real-time mirror status with whimsical messaging
- **Apps**: Open/close individual apps with one-click controls
- **System**: Brightness control and system management (restart, reboot, refresh)
- **Mobile-First**: Responsive design that works beautifully on all devices
- **Accessible**: WCAG 2.2 AA compliant with proper ARIA labels and keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Magic Mirror 2 with MMM-Remote-Control module installed

### Installation

1. Clone this repository:

```bash
git clone <your-repo-url>
cd mirror-mirror
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API URL:
   Create a `.env` file in the root directory:

```bash
# Set this to your Magic Mirror's IP address and port
VITE_MIRROR_API_URL=http://192.168.1.80:8080
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser to `http://localhost:5175`

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# MMM-Remote-Control API Configuration
VITE_MIRROR_API_URL=http://localhost:8080

# API Key (optional - only if MMM-Remote-Control is configured to require authentication)
VITE_MIRROR_API_KEY=your_api_key_here
```

**Common configurations:**

- Raspberry Pi on local network: `http://192.168.1.80:8080`
- Using hostname: `http://raspberrypi.local:8080`
- Local development: `http://localhost:8080`

**API Endpoints:**

- All endpoints are under `/api/` path (e.g., `/api/test`, `/api/config`)
- Uses official MMM-Remote-Control API endpoints
- GET requests for most operations, POST for config changes
- Key endpoints: `/api/test`, `/api/config`, `/api/module/installed`, `/api/brightness/{value}`

### MMM-Remote-Control Setup

Ensure your Magic Mirror has the MMM-Remote-Control module installed and configured:

1. Install the module:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/Jopyth/MMM-Remote-Control.git
```

2. Add to your `config.js`:

```javascript
{
  module: 'MMM-Remote-Control',
  config: {
    port: 8080,
    allowCommands: true,
    allowModules: true,
    allowSystem: true,
    cors: {
      origin: ["*"],
      credentials: false
    },
    // Optional: Enable API key authentication
    // apiKey: "your_secret_api_key_here"
  }
}
```

3. Restart your Magic Mirror

4. Test the API by visiting `/test` in the web interface

### CORS Configuration

The application is configured to work with global CORS settings. Ensure your MMM-Remote-Control configuration includes:

```javascript
{
  module: 'MMM-Remote-Control',
  config: {
    port: 8080,
    allowCommands: true,
    allowModules: true,
    allowSystem: true,
    cors: {
      origin: ["*"],
      credentials: false
    }
  }
}
```

**Note**: This configuration allows any origin to access the API. For production, consider restricting the `origin` array to specific domains.

### API Key Authentication

If you've enabled API key authentication in your MMM-Remote-Control configuration, you'll need to:

1. Set the `apiKey` in your MMM-Remote-Control config.js
2. Add the same key to your `.env` file as `VITE_MIRROR_API_KEY`
3. The API key will be automatically included in all requests

**Troubleshooting API Key Issues:**

- If you get "Forbidden: API Key Not Provided!" errors, check that `VITE_MIRROR_API_KEY` is set in your `.env` file
- Ensure the API key in your `.env` file matches the one in your MMM-Remote-Control configuration
- API keys are case-sensitive

## 🎨 Design System

This project follows a mobile-first, accessible design approach:

- **Colors**: Pink primary (`#FF4FB6`), clean grays, and high contrast
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable MUI components with custom styling

## 📱 Mobile-First Approach

- Base styles are mobile-optimized
- Desktop enhancements via `theme.breakpoints.up()`
- Touch-friendly buttons and controls
- Responsive navigation with collapsible drawer

## ♿ Accessibility Features

- Keyboard navigation support
- ARIA labels and semantic HTML
- High contrast ratios (4.5:1 minimum)
- Focus indicators and screen reader support
- Reduced motion preferences respected

## 🏗️ Project Structure

```
src/
├── api/
│   └── client.ts          # MMM-Remote-Control API client
├── components/
│   ├── AppLayout.tsx      # Main layout with navigation
│   ├── FairytaleHeading.tsx # Whimsical section headers
│   ├── ActionGrid.tsx     # Reusable action card grid
│   ├── (animations planned) # Future animated components
│   └── index.ts           # Component exports
├── pages/
│   ├── Dashboard.tsx      # Mirror status overview
│   ├── Modules.tsx        # App management
│   ├── System.tsx         # System settings
│   └── index.ts           # Page exports
├── theme.ts               # MUI theme configuration
└── App.tsx               # Main app with routing
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **Styling**: MUI SX prop + styled API
- **Font**: Inter (via @fontsource)
- **Animations**: Planned for future implementation

## 🎭 Whimsical Theme

The interface uses fairytale-inspired language while keeping functionality clear:

- "Apps" = Modules (user-friendly terminology)
- "Charlotte's Mirror Mirror" branding
- Magical animations (planned)

All user-facing buttons and controls use plain English for clarity.

## 🤝 Contributing

1. Follow the mobile-first, accessible design principles
2. Use theme tokens for colors, spacing, and typography
3. Include proper ARIA labels and keyboard support
4. Test on mobile devices
5. Keep components small and single-purpose

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Magic Mirror 2](https://github.com/MichMich/MagicMirror) - The amazing smart mirror platform
- [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) - The remote control API module
- [Material-UI](https://mui.com/) - The excellent React UI library
