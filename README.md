# LaunchPad - Employee Management & File Sharing Web App

A modern web application for employee management, attendance tracking, and secure file sharing. This application is built with React and includes features such as user authentication, employee registration, attendance tracking, and file uploading with drag and drop functionality.

## Features

- **User Authentication**: Secure user registration and login with email/password
- **Employee Management**: Register new employees with detailed information
- **Attendance Tracking**: Mark daily attendance through an intuitive sidebar interface
- **Dashboard**: Visual overview of attendance patterns, leaves, and activities with interactive charts
- **File Upload**: Easy file uploading with drag and drop functionality (supports PDF and TXT formats)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Animated UI**: Beautiful and engaging user interface with smooth animations

## Technologies Used

- React
- React Router DOM (for routing)
- Axios (for API requests)
- Styled Components (for styling)
- Framer Motion (for animations)
- Material-UI (for UI components)
- React Icons
- Day.js (for date handling)

## APIs Used

- Employee Registration API: `http://127.0.0.1:5003/employees`
- Attendance API: `http://127.0.0.1:5003/attendance`
- File Upload API: `http://127.0.0.1:5003/upload`

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher recommended)
- npm or yarn
- Backend server running on port 5003

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

### Running the Application

1. Make sure your backend server is running on port 5003

2. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

3. Open your browser and navigate to `http://localhost:3000`

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

- `src/components`: Reusable UI components including DashboardLayout and Sidebar
- `src/context`: Context providers for authentication and state management
- `src/hooks`: Custom React hooks for file uploading and other functionality
- `src/pages`: Application pages including Login, Register, Dashboard, and FileUpload
- `src/charts`: Chart components for the dashboard visualizations
- `src/styles`: Global styles

## Usage Guide

### Registration
1. Navigate to the registration page
2. Fill in required employee details (name, email, phone, role, level, etc.)
3. Submit to create a new employee account

### Login
1. Enter your registered email and password
2. Click "Login" to access the dashboard

### Attendance Marking
1. On the sidebar, check the "Mark Present" box to record your attendance for the day
2. A confirmation message will appear when attendance is successfully recorded

### File Upload
1. Navigate to the "Upload Files" page
2. Drag and drop PDF or TXT files, or click to browse
3. Click "Upload All Files" to upload selected files
4. View upload progress and status for each file

## Calendar Color Guide

- **Purple**: Weekend days (Saturday and Sunday)
- **Orange**: Future days
- **Green**: Present days (days you were present)
- **Red**: Leave days
- **Bordered**: Today's date

## License

This project is licensed under the MIT License

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Day.js](https://day.js.org/)
