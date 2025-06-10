# EV Care Assist – On-Demand Electric Vehicle Repair & Support

## Project Overview
EV Care Assist is a full-stack web application that connects EV owners with repair and support services. Users can book services, track requests, and get assistance for their electric vehicles.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB

## System Architecture
```
Client (Browser)
    ↓
Frontend (HTML/CSS/JS)
    ↓
Express.js Server (REST API)
    ↓
MongoDB Database
```

## Features
- Service booking system
- Multiple service types (Diagnosis, Roadside, Workshop, Authorized)
- Admin dashboard to view all requests
- Form validation
- Responsive design

## API Endpoints

### POST /api/book-service
Books a new service request
- **Body**: { name, phone, email, evModel, problemType, location, description }
- **Response**: { success: true, message, data }

### GET /api/requests
Retrieves all service requests
- **Response**: { success: true, data: [...] }

## Database Schema

### ServiceRequest Collection
```javascript
{
  name: String (required),
  phone: String (required),
  email: String (required),
  evModel: String (required),
  problemType: String (required),
  location: String (required),
  description: String,
  status: String (default: "Pending"),
  date: Date (default: now)
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Steps to Run Locally

1. **Clone or download the project**

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Configure MongoDB**
   - Update the MongoDB connection string in `backend/config/db.js`
   - Default: `mongodb://localhost:27017/evcareassist`
   - For MongoDB Atlas, use your connection string

4. **Start the server**
```bash
node server.js
```
Server will run on `http://localhost:5000`

5. **Open the frontend**
   - Open `frontend/index.html` in your browser
   - Or use Live Server extension in VS Code

## Project Structure
```
ev-care-assist/
├── frontend/
│   ├── index.html          # Home page
│   ├── services.html       # Services listing
│   ├── howitworks.html     # Process explanation
│   ├── book.html           # Booking form
│   ├── contact.html        # Contact information
│   ├── admin.html          # Admin dashboard
│   ├── style.css           # Styling
│   └── script.js           # Frontend logic
├── backend/
│   ├── server.js           # Express server
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── models/
│   │   └── ServiceRequest.js  # Mongoose schema
│   └── routes/
│       └── serviceRoutes.js   # API routes
├── package.json
└── README.md
```

## Usage

1. Navigate to the home page
2. Click "Book EV Service"
3. Fill in the booking form with your details
4. Submit the form
5. Admin can view all requests at `admin.html`

## Future Enhancements
- User authentication
- Real-time tracking
- Payment integration
- Technician assignment system
- Email/SMS notifications

## Developer Notes
This project demonstrates:
- RESTful API design
- Client-server architecture
- Database integration with MongoDB
- Form validation
- Responsive web design
- Error handling

Perfect for understanding full-stack development concepts in an internship or academic setting.

## Contact
Email: support@evcareassist.com
Phone: +91-XXXXXXXXXX
