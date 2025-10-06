# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## ParkEase: Vehicle Management System 

**Manage your parking facility with a modern, secure, and real-time reservation system.**

This project is a full-stack solution built to streamline vehicle management, slot booking, and real-time occupancy monitoring using **React**, **Node.js (Express)**, and **Supabase**.

---

## 1. What is ParkEase? (Project Overview)

**ParkEase** is a digital application that eliminates the chaos of manual parking management. It offers a secure, reliable platform for both customers looking to reserve a spot and administrators tasked with managing the parking infrastructure.

### It Solves Two Main Problems:

1. **For Customers:** No more driving around looking for a spot. Users can **view availability** and **book reservations** directly through a simple web interface.
2. **For Management:** Provides a **real-time dashboard** to see exactly which spots are occupied, by whom, and for how long. It also allows for digital management of all parking lots and individual slots (activating/deactivating them as needed).

---

## 2. Key Features

The system is divided into two main interfaces, each with its own set of tools:

###  User Features (Frontend: Dashboard.jsx, BookReservation.jsx, History.jsx)

- **Simple Sign-up/Login:** Secure user authentication handled by **Supabase Auth** (Login.jsx, Signup.jsx).
- **Easy Booking:** Reserve a specific parking spot for a defined time window.
- **Reservation History:** Track past and upcoming bookings.

###  Admin/Management Features (Frontend: AdminDashboard.jsx, Occupancy.jsx, ManageSpots.jsx, ManageSlots.jsx)

- **Live Occupancy Monitor:** See a table of **all currently parked vehicles** in real-time (Occupancy.jsx).
- **Lot Management:** Add, name, locate, and globally activate/deactivate entire parking facilities (ManageSpots.jsx).
- **Slot Management:** Detailed control over individual spots (numbering, type, active status) within a lot (ManageSlots.jsx).
- **Secure Access:** All management tools are protected by role-based access control (Admin Role).

---

## 3. Technology Stack (The Building Blocks)

This project uses a modern, standard JavaScript stack, making it easy to develop and maintain.

| Component | Technology | Why We Chose It |

| **Frontend (UI)** | **React.js** | A fast, component-based library for building interactive user interfaces. |

| **Backend (API)** | **Node.js / Express** | A lightweight and fast server runtime environment for handling API requests and business logic (server.js). |

| **Database & Auth** | **Supabase** | A powerful, hosted **PostgreSQL database** that also provides **JWT authentication** out-of-the-box, simplifying security. |

| **Security** | **JWT Tokens** | Used to secure all API communication between React and Express (api.js). |



## 4. Getting Started (Setup Instructions)

Follow these three simple steps to get the system running locally for development.

### Prerequisites

You need the following software installed on your computer:

1. **Node.js** (v16 or newer)
2. **npm** (Node Package Manager)
3. **Git**
4. A **Supabase Project** (a free account/project is sufficient).



### Step A: Supabase (Database & Authentication) Setup

1. **Create a Project and Get Keys:**
   - Sign up/Log in to Supabase and create a new project.
   - Note your **Project URL** and **Anon Public Key**.
   - Go to **Settings** -> **API** and copy the **service_role** (Service Key/Secret). **This key is critical and should be kept private.**

2. **Create Database Tables:**

   The system requires the following tables to be created in your Supabase SQL Editor. The relationships are vital for the application logic:

   | Table Name | Purpose | Key Foreign Keys (FKs) |
   |
   | **lots** | Parking facilities (e.g., "Main Garage"). | None |
   | **slots** | Individual spots (e.g., "A101"). | FK to lots.id |
   | **profiles** | Stores user roles. | FK to auth.users.id |
   | **reservations** | Stores booking records. | FK to auth.users.id and slots.id |

3. **Initial Admin Setup:**
   - Sign up a new user via the application's /signup page.
   - Find the entry for this new user in your Supabase **profiles** table and manually change their role column value to **ADMIN**. This grants you initial access to the management tools.



### Step B: Backend (Node.js/Express) Setup

The backend logic resides in the server.js file.

1. **Clone the Code & Navigate:**

   ```bash
   git clone [Your Repository URL]
   cd [Project Folder Name]
   ```

2. **Install Dependencies:**

   ```bash
   # Install Express, CORS, Supabase client, and dotenv
   npm install express cors dotenv @supabase/supabase-js
   ```

3. **Configure Environment Variables:**

   Create a file named **.env** in the same directory as server.js and paste your Supabase keys:

   ```env
   # .env file
   SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
   SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
   SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
   PORT=3001
   ```

4. **Start the Backend Server:**

   ```bash
   node server.js
   ```

   The API will be running at **http://localhost:3001**.



### Step C: Frontend (React) Setup

Assuming your React files (like Login.jsx and api.js) are in a folder named client/.

1. **Navigate to Frontend Directory:**

   ```bash
   cd client/  
   ```

2. **Install Frontend Dependencies:**

   ```bash
   npm install
   ```

3. **Verify API URL:**
   - Open the file **api.js**.
   - Ensure the BASE_URL constant points to your running backend:

     ```javascript
     const BASE_URL = "http://localhost:3001/api";
     ```

4. **Start the Frontend App:**

   ```bash
   npm start
   ```

   The application will open in your browser, typically at **http://localhost:3000**.

---

## 5. Using the Application

1. **Admin Login:** Use the credentials of the user whose role you manually set to **ADMIN**.

2. **Setup Infrastructure:**
   - Go to **Admin Dashboard** -> **Manage Parking Lots** (ManageSpots.jsx) to create your first lot (e.g., "North Deck").
   - Go to **Manage Parking Slots** (ManageSlots.jsx) to add individual slots (e.g., "A1", "A2") to that lot.

3. **User Booking:**
   - Log out and create a new user account.
   - Log in as a standard user.
   - Go to **Book Parking** (BookReservation.jsx) to reserve an available slot.

4. **Monitor:** Log back in as the **ADMIN** and check the **Active Parking Occupancy** page (Occupancy.jsx) to see the live reservation you just created.



## 6. Project Files and Structure

The project is logically separated between the server and the client, with core functionality distributed across the following key files:

| File Name | Role | Function |
|:---|:---|:---|
| server.js | **BACKEND (Express API)** | Defines all the secure routes, implements the admin middleware, and interacts directly with Supabase via the Service Role Key. |
| api.js | **Frontend Utility** | The **secure fetch wrapper** that ensures every request from the React app includes the necessary JWT token for security. |
| Login.jsx, Signup.jsx | **Frontend (Auth)** | Handles user registration and authentication flow. |
| Occupancy.jsx | **Frontend (Admin)** | Displays real-time data on active, current reservations. |
| ManageSpots.jsx | **Frontend (Admin)** | UI for creating and managing large parking areas (Lots). |
| BookReservation.jsx | **Frontend (User)** | UI for selecting a time, slot, and submitting a new reservation. |



## 7. Contributing

If you want to contribute, whether by fixing a bug, adding a new feature, or improving documentation, we welcome it!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: Added hourly rate calculator'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.


## 8. License

This project is open-source and released under the **MIT License**.