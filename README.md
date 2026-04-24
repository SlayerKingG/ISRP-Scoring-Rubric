# 🚔 ISRP PD Rank Promotion Tracker

A full-stack web application for managing officer rank progression and promotions in Imagination Station Roleplay's Police Department.

## Features

- **Officer Management**: Add, edit, and view detailed officer profiles
- **Rank Tracking**: Monitor time in current rank and promotion eligibility
- **Promotion History**: View complete promotion history for each officer
- **Advanced Filtering**: Filter officers by rank, promotion status, and search by name
- **Appointment Tracking**: Support for appointment-only ranks (Lieutenant, Captain, Major)
- **Promotion Ready Status**: Mark officers as ready/not ready for promotion
- **Responsive Design**: Works on desktop and mobile devices

## Rank Structure

### Promotable Ranks (Sequential Progression)
- Recruit
- Officer
- Corporal
- Sergeant
- Staff Sergeant

### Appointment-Only Ranks (Manual Assignment)
- Lieutenant
- Captain
- Major

## Tech Stack

**Backend**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Express Validator for input validation
- CORS enabled for frontend communication

**Frontend**
- React 18
- Axios for API requests
- CSS3 for styling
- Responsive design with CSS Grid and Flexbox

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SlayerKingG/ISRP-Scoring-Rubric.git
   cd ISRP-Scoring-Rubric
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup Environment Variables**
   
   **Backend** (.env in backend folder):
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/isrp-pd-tracker
   NODE_ENV=development
   ```
   
   Or for MongoDB Atlas:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/isrp-pd-tracker?retryWrites=true&w=majority
   ```

4. **Start the Application**

   **Option A: Run both together**
   ```bash
   npm run dev
   ```
   This starts both backend (port 5000) and frontend (port 3000) concurrently.

   **Option B: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run backend
   
   # Terminal 2 - Frontend
   npm run frontend
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Officers Endpoints

#### Get All Officers
```
GET /officers
Query Parameters:
  - rank: Filter by rank
  - readyForPromotion: Filter by promotion status (true/false)
  - search: Search by officer name
  - sortBy: Sort by 'createdAt', 'name', 'rank', or 'daysInRank'

Example:
GET /officers?rank=Officer&sortBy=daysInRank
```

#### Get Officers Grouped by Rank
```
GET /officers/grouped/byrank
Returns: Object with rank keys containing arrays of officers
```

#### Get Single Officer
```
GET /officers/:id
```

#### Create Officer
```
POST /officers
Body:
{
  "name": "John Doe",
  "currentRank": "Recruit",
  "joinDate": "2024-01-15",
  "dateJoinedCurrentRank": "2024-01-15",
  "evaluationNotes": "Good performance",
  "readyForPromotion": false
}
```

#### Update Officer
```
PUT /officers/:id
Body: (all fields optional)
{
  "name": "Jane Doe",
  "evaluationNotes": "Excellent work",
  "readyForPromotion": true
}
```

#### Delete Officer
```
DELETE /officers/:id
```

### Promotions Endpoints

#### Get Promotion History
```
GET /promotions/history/:officerId
Returns: Array of promotion records
```

#### Promote Officer
```
POST /promotions/promote/:officerId
Body:
{
  "toRank": "Officer",
  "promotedBy": "Chief Commander"
}
```

#### Get Officers Ready for Promotion
```
GET /promotions/ready/list
Returns: Array of officers marked as ready for promotion
```

## Usage Guide

### Adding an Officer

1. Click "Add Officer" in the navigation
2. Fill in the officer's information:
   - Name (required)
   - Current Rank (defaults to Recruit)
   - Join Date (required)
   - Date Joined Current Rank (required)
   - Evaluation Notes (optional)
3. Optionally mark as ready for promotion
4. Click "Add Officer"

### Viewing Officer Details

1. On the dashboard, click "View Details" on any officer card
2. See complete information including:
   - Rank and time in current rank
   - Join dates
   - Evaluation notes
   - Complete promotion history
   - Next eligible rank

### Promoting an Officer

1. View officer details
2. Click "Promote to [Rank]" or "Appoint to Different Rank"
3. Select the new rank
4. Enter who is promoting them
5. Confirm promotion
6. System automatically updates rank and resets "Ready" status

### Marking Officers Ready for Promotion

1. **From Dashboard**: Click the "Mark Ready" button on any officer card
2. **From Detail View**: Click "Mark as Ready for Promotion" button

### Filtering and Searching

1. **By Rank**: Use the rank dropdown to filter
2. **By Status**: Filter by promotion readiness
3. **By Name**: Use the search box to find officers
4. **Sort**: Choose sorting method (Date Added, Name, Rank, Time in Rank)

## Project Structure

```
ISRP-Scoring-Rubric/
├── backend/
│   ├── models/
│   │   └── Officer.js          # Officer schema and methods
│   ├── routes/
│   │   ├── officers.js         # Officer CRUD endpoints
│   │   └── promotions.js       # Promotion endpoints
│   ├── server.js               # Express server setup
│   ├── package.json
│   ├── .env.example
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OfficersList.js
│   │   │   ├── OfficersList.css
│   │   │   ├── AddOfficerForm.js
│   │   │   ├── AddOfficerForm.css
│   │   │   ├── OfficerDetail.js
│   │   │   └── OfficerDetail.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── node_modules/
├── package.json
├── .gitignore
└── README.md
```

## Future Enhancements

- [ ] Time-based promotion requirements per rank
- [ ] Bulk officer import (CSV/Excel)
- [ ] Role-based access control (Admin, Commander, Viewer)
- [ ] Automated promotion eligibility checking
- [ ] Department statistics and analytics
- [ ] Officer performance metrics
- [ ] Disciplinary record tracking
- [ ] Export reports (PDF, CSV)
- [ ] Notifications for promotion milestones
- [ ] Mobile app with push notifications

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or your Atlas cluster is accessible
- Check your connection string in .env file
- Verify network access if using MongoDB Atlas

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Clear browser cache and restart both servers

### Port Already in Use
- Backend (5000): `lsof -i :5000` then kill the process
- Frontend (3000): `lsof -i :3000` then kill the process

## Contributing

1. Create a feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Open a Pull Request

## License

MIT License - feel free to use this project for your community

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Made with ❤️ for Imagination Station Roleplay
