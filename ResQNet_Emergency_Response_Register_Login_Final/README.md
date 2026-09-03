# ResQNet — Enhanced Emergency Response Platform

SIH-style frontend prototype for an Emergency Response & Resource Allocation Platform.

## New interactive features
- Live-style command center dashboard
- Dark / light mode toggle
- Notification center
- Interactive incident map markers
- Incident detail modal with status workflow
- Search + priority + status filters
- One-click incident simulation
- Emergency report validation
- Resource dispatch / release controls
- Fleet refresh interaction
- Hospital recommendation and patient routing
- Live dashboard counters
- Interactive analytics bars
- Responsive mobile layout
- Toast notifications for user actions

## Files
- `index.html` — complete web interface
- `css/style.css` — responsive UI and theme styling
- `js/app.js` — mock data and all interactions

## Run
Double-click `index.html` or use VS Code Live Server.

## Future SIH-ready backend integration
Spring Boot REST APIs, MySQL, authentication/RBAC, real GPS maps, WebSocket updates, ML severity prediction, route optimization, SMS/email alerts, ambulance GPS tracking, audit logs and role-based dispatcher/admin dashboards.


## Login & Role-Based Access
The enhanced frontend now includes a secure-looking login flow with two roles:

### User Demo
- Email: `user@resqnet.com`
- Password: `user123`
- Access: dashboard, report emergency, incidents, resources, hospitals

### Admin Demo
- Email: `admin@resqnet.com`
- Password: `admin123`
- Access: all user features + Analytics + Admin Control Panel

### Admin Panel
Includes demo sections for:
- User Management
- Access Control
- Audit Logs
- System Settings
- Recent Admin Activity

> Note: These credentials are frontend demo credentials. For a real SIH deployment, connect authentication to a backend with hashed passwords, sessions/JWT, RBAC, database storage and audit logging.


## Styling Upgrade
- Premium command-center visual system
- Glass-like header treatment
- Gradient hero sections
- Hover/focus micro-interactions
- Animated incident markers
- Improved cards, tables, progress bars and buttons
- Responsive mobile polish
- Enhanced shadows, spacing, typography and visual hierarchy


## Registration
The login screen now includes a **Create an account** flow:
- Full name
- Email
- Phone number
- Password
- Confirm password
- Terms acceptance
- Client-side validation
- Automatic return to login after successful registration

The registered account is kept in the current frontend session for this demo. Production deployment should persist users in MySQL/PostgreSQL through the backend and hash passwords securely.
