# Job Management System

A complete job management system with CRUD operations for managing job postings.

## Features

### 1. Job Listing (`/jobs`)
- Display all jobs in a responsive table
- Color-coded status badges (Draft, Published, Closed, Archived)
- Category badges with different colors
- Experience level indicators
- Job type badges
- Action buttons for View, Edit, and Delete
- Empty state with call-to-action

### 2. Add New Job (`/jobs/add`)
- Form with all required fields
- Real-time validation using react-hook-form
- Dropdown selections for:
  - Status (Draft, Published, Closed, Archived)
  - Category (Sales, Marketing, Development, Design, etc.)
  - Experience Level (Entry, Junior, Mid, Senior, Executive)
  - Job Type (Full Time, Part Time, Contract, Internship, Freelance)
- Responsive design

### 3. Edit Job (`/jobs/edit/:id`)
- Pre-populated form with existing job data
- Same validation and field structure as Add form
- Update functionality with success/error handling

### 4. View Job (`/jobs/view/:id`)
- Read-only display of job details
- Clean, card-based layout
- All job information with proper formatting
- Edit button to navigate to edit form
- Metadata display (Job ID, creation/update dates)

### 5. Delete Job
- Confirmation modal before deletion
- Success/error toast notifications
- Automatic list refresh after deletion

## Data Structure

Each job has the following fields:

```javascript
{
  _id: "string",           // Auto-generated ID
  title: "string",         // Job title (required)
  description: "string",   // Job description (required)
  category: "string",      // One of: sales, marketing, development, design, administration, customer_service, finance, human_resource, operation, other
  experience_level: "string", // One of: entry, junior, mid, senior, executive
  job_type: "string",      // One of: full_time, part_time, contract, internship, freelance
  location: "string",      // Job location (required)
  status: "string",        // One of: draft, published, closed, archived
  createdAt: "Date",       // Auto-generated
  updatedAt: "Date"        // Auto-generated
}
```

## API Endpoints

The system uses the following API endpoints:

- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get a specific job
- `POST /jobs` - Create a new job
- `PUT /jobs/:id` - Update a job
- `DELETE /jobs/:id` - Delete a job

## Components

### Main Components
- `Jobs` - Main listing page
- `JobForm` - Reusable form component for Add/Edit
- `AddJob` - Add job page wrapper
- `EditJob` - Edit job page wrapper
- `ViewJob` - Job details view

### Styling
- `Jobs.module.css` - Styles for listing page
- `JobForm.module.css` - Styles for form pages
- `JobView.module.css` - Styles for view page

### Services
- `jobsApi.js` - API service functions

## Usage

1. **Navigate to Jobs**: Go to `/jobs` to see all job postings
2. **Add New Job**: Click "Add New Job" button or navigate to `/jobs/add`
3. **Edit Job**: Click the edit icon on any job row or navigate to `/jobs/edit/:id`
4. **View Job**: Click the view icon on any job row or navigate to `/jobs/view/:id`
5. **Delete Job**: Click the delete icon and confirm in the modal

## Validation Rules

- **Title**: Required, minimum 3 characters
- **Description**: Required, minimum 10 characters
- **Category**: Required, must be one of the predefined options
- **Experience Level**: Required, must be one of the predefined options
- **Job Type**: Required, must be one of the predefined options
- **Location**: Required
- **Status**: Required, must be one of the predefined options

## Color Coding

### Status Badges
- Draft: Gray
- Published: Green
- Closed: Red
- Archived: Purple

### Category Badges
- Sales: Green
- Marketing: Red
- Development: Blue
- Design: Purple
- Administration: Orange
- Customer Service: Cyan
- Finance: Green
- Human Resource: Purple
- Operation: Red
- Other: Gray

### Experience Level Badges
- Entry: Green
- Junior: Blue
- Mid: Orange
- Senior: Purple
- Executive: Red

### Job Type Badges
- Full Time: Green
- Part Time: Blue
- Contract: Orange
- Internship: Purple
- Freelance: Red

## Responsive Design

The system is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Dependencies

- React Hook Form for form management
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- React Router for navigation
