# LaunchPad - Employee Management & Leave Tracking System

A modern web application for employee management, attendance tracking, leave management, and secure file sharing. This application is built with React and includes features such as user authentication, employee registration, attendance tracking with Work From Home options, leave application and approval workflows, and secure file uploading.

## Live Demo

Experience the LaunchPad application live at [https://docuseek.netlify.app/](https://docuseek.netlify.app/)

*Note: For admin access, use email: admin@payoda.com*

## Features

- **User Authentication**: Secure user registration and login with email/password
- **Employee Management**: Register new employees with detailed information
- **Attendance Tracking**: Mark daily attendance with options for Present, Work From Home, or Absent
- **Leave Management**: Apply for leaves, view leave history, and approve/reject leave requests
- **Admin Dashboard**: Admin interface for viewing and managing all leave requests with filtering options
- **Dashboard**: Visual overview of attendance patterns, leaves, and activities with interactive charts
- **File Upload**: Easy file uploading with drag and drop functionality (supports PDF and TXT formats)
- **Document Classification**: Classify uploaded documents as Public, Private, or Protected
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

- Employee Service: `https://emploeeservice.onrender.com/`
  - Employee Registration: `/employees`
  - Authentication: `/login`
  - Attendance: `/attendance`
  - Leave Requests: `/get-all-request`
- File Upload: `https://information-retrieval-service.onrender.com/upload`

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

- `src/components`: Reusable UI components including DashboardLayout and Sidebar
- `src/context`: Context providers for authentication and state management
- `src/hooks`: Custom React hooks for file uploading and other functionality
- `src/pages`: Application pages including Login, Register, Dashboard, and FileUpload
  - `src/pages/leaves`: Leave management pages (ApplyLeaves, ApproveLeaves)
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
1. On the sidebar, use the radio buttons to mark your daily status:
   - Mark Present: Record in-office attendance
   - Mark WFH: Record working from home
   - Absent: Default state when no option is selected
2. A confirmation message will appear when attendance is successfully recorded

### Leave Management
1. Apply for Leave:
   - Navigate to the "Apply Leaves" page
   - Select leave type (Leave or WFH)
   - Select date range and provide reason
   - Submit leave request
2. View Leave History:
   - All your leave requests are displayed with their current status
   - Filter requests by type or date

### Admin Features
1. Admin Dashboard:
   - Automatically shown to users with email "admin@payoda.com"
   - View all leave requests across the organization
   - Filter requests by employee or status
2. Leave Approval:
   - Navigate to "Approve Leaves" page
   - Review pending leave requests
   - Approve or reject requests

### File Upload
1. Navigate to the "Upload Files" page
2. Select a document type (Public, Private, or Protected)
3. Drag and drop PDF or TXT files, or click to browse
4. Click "Upload All Files" to upload selected files
5. View upload progress and status for each file

## Calendar Color Guide

- **Purple**: Weekend days (Saturday and Sunday)
- **Orange**: Future days
- **Green**: Present days (days you were present)
- **Blue**: Work From Home days
- **Red**: Leave/Absent days
- **Bordered**: Today's date

## Access Control

- Regular users: Can view their own dashboard, apply for leaves, and view their leave history
- Admin users: Can access the admin dashboard and approve/reject leave requests from all employees
  - Admin access is granted to users with email "admin@payoda.com"

## License

This project is licensed under the MIT License

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Day.js](https://day.js.org/)
