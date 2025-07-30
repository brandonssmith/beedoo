# Beedoo Task Manager

A responsive web-based task management app that supports tasks with subtasks and next steps, each with estimated and actual time tracking. The app is designed to work across multiple devices with server-side storage.

## Features

- **Hierarchical Task Management**: Create tasks with unlimited nested subtasks and next steps
- **Time Tracking**: Track estimated vs actual time for each task
- **Priority Levels**: Set priority levels (urgent, high, medium, low) for tasks
- **Completion Tracking**: Mark tasks as complete with visual indicators
- **Cross-Device Sync**: Access your tasks from any device with internet connection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Data Export/Import**: Backup and restore your data via JSON files
- **Real-time Status**: Visual indicators for online/offline status

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Netlify Functions (serverless)
- **Storage**: File-based JSON storage on server
- **Deployment**: Netlify

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beedoo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Netlify CLI globally** (for local development)
   ```bash
   npm install -g netlify-cli
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the React development server and the Netlify Functions locally.

5. **Open your browser**
   Navigate to `http://localhost:8888` to see the app running with server-side storage.

### Development Scripts

- `npm start` - Start React development server only (no backend)
- `npm run dev` - Start full development environment with Netlify Functions
- `npm run build` - Build the production version
- `npm test` - Run tests

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Deploy!

3. **Configure Functions**
   - In your Netlify dashboard, go to Functions
   - The `tasks.js` function should be automatically detected
   - Your API will be available at `https://your-site.netlify.app/.netlify/functions/tasks`

### Option 2: Deploy via Netlify CLI

1. **Login to Netlify**
   ```bash
   netlify login
   ```

2. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## API Endpoints

The app uses a single serverless function with the following endpoints:

- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Save all tasks

### Local Development URLs

- Frontend: `http://localhost:8888`
- API: `http://localhost:8888/.netlify/functions/tasks`

### Production URLs

- Frontend: `https://your-site.netlify.app`
- API: `https://your-site.netlify.app/.netlify/functions/tasks`

## Data Storage

- **Server Storage**: All task data is stored in a JSON file on the Netlify server
- **Automatic Sync**: Changes are automatically saved to the server
- **Offline Handling**: The app shows connection status and retry options
- **Backup**: Export/import functionality for data backup and transfer

## Project Structure

```
beedoo/
├── netlify/
│   ├── functions/
│   │   └── tasks.js          # Serverless API function
│   └── data/                 # Server data storage (auto-created)
├── src/
│   ├── components/           # React components
│   ├── services/             # API service layer
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── App.tsx              # Main app component
├── netlify.toml             # Netlify configuration
└── package.json
```

## Environment Variables

The app automatically detects the environment and uses the appropriate API URL:

- **Development**: Uses local Netlify Functions server
- **Production**: Uses the deployed Netlify Functions

## Troubleshooting

### Common Issues

1. **Functions not working locally**
   - Ensure Netlify CLI is installed: `npm install -g netlify-cli`
   - Use `npm run dev` instead of `npm start`

2. **CORS errors**
   - The serverless function includes CORS headers for cross-origin requests
   - Check that the API URL is correct for your environment

3. **Data not persisting**
   - Check the browser console for API errors
   - Verify the Netlify function is deployed and accessible
   - Check the connection status indicator in the app

4. **Build failures**
   - Ensure all dependencies are installed: `npm install`
   - Check for TypeScript errors: `npm run build`

### Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your Netlify function is deployed and accessible
3. Test the API endpoint directly: `https://your-site.netlify.app/.netlify/functions/tasks`

## License

This project is open source and available under the MIT License. 