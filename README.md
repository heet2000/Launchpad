# Secure File Management Web App

A modern web application for storing, managing, and sharing files securely. This application is built with React and includes features such as user authentication, file uploading with drag and drop functionality, and a responsive design with an attractive animated background.

## Features

- **User Authentication**: Secure user registration and login with Firebase Authentication
- **Dashboard**: Visual overview of your files and activities
- **File Upload**: Easy file uploading with drag and drop functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Animated UI**: Beautiful and engaging user interface with animations

## Technologies Used

- React
- React Router DOM (for routing)
- Firebase (Authentication, Firestore, Storage)
- Styled Components (for styling)
- Framer Motion (for animations)
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
   ```
   cd my-web-app
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage services
   - Get your Firebase configuration

5. Configure environment variables:
   - Rename `.env.example` to `.env` (or create a new `.env` file)
   - Add your Firebase configuration to the `.env` file:
     ```
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your-app-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

### Running the Application

1. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:
```
npm run build
```
or
```
yarn build
```

The build will be created in the `build` folder.

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: Context providers for state management
- `src/hooks`: Custom React hooks
- `src/pages`: Application pages/views
- `src/styles`: Global styles
- `src/utils`: Utility functions
- `src/assets`: Static assets like images

## License

This project is licensed under the MIT License

## Acknowledgements

- [Create React App](https://create-react-app.dev/)
- [Firebase](https://firebase.google.com/)
- [React Router](https://reactrouter.com/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
