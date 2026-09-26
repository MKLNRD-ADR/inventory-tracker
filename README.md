# Inventory Tracker

A simple inventory management system built for a technical assessment. It lets you log in, manage stock items (add, edit, delete), and view a low-stock report that can also be downloaded as a PDF.

## Tech Stack
- Frontend: React (Vite) + Ant Design
- Backend: Express.js
- Database: MSSQL
- Auth: JWT + bcrypt

## Prerequisites
- Node.js (LTS)
- SQL Server Express or another MSSQL instance
- SSMS or another way to run SQL scripts (optional but helpful)

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/MKLNRD-ADR/inventory-tracker.git
cd inventory-tracker
```

### 2. Database setup
Create a database named `InventoryTrackerDB` in SQL Server, then select that database and run the SQL in `database/schema.sql`. The script creates the `Users` and `Items` tables.

For SQL Server Express, make sure TCP/IP is enabled and note the TCP port your instance is using. If you're using a fresh SQL Server Express install with a dynamic port, you may want to set a fixed TCP port in SQL Server Configuration Manager (TCP/IP Properties > IP Addresses > IPAll) for a more reliable connection.

You'll also need at least one user in the `Users` table to log in with. Passwords are stored as bcrypt hashes, not plain text. You can use this ready-made insert statement, it creates a user `admin` with the password `test123`:

```sql
INSERT INTO Users (username, password) VALUES ('admin', '$2b$10$4eOOEd5el.KAQkvaBaKrOuzS5KMwm6ho9msP5E4Kr9V0MmUbqavpG');
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
DB_SERVER=localhost
DB_PORT=your_sql_server_port
DB_DATABASE=InventoryTrackerDB
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
JWT_SECRET=your_random_secret
PORT=5000
```

Replace `DB_SERVER` and `DB_PORT` with the SQL Server host and TCP port used by your installation. If SQL Server Express is using a dynamic port instead, find the current port in SQL Server Configuration Manager or assign a fixed TCP port and use that value here.

Start the backend server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 4. Frontend setup

Open a second terminal in the project folder, then run:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown by Vite in the terminal, usually:

```text
http://localhost:5173
```

## Test Login

```text
Username: admin
Password: test123
```

## Testing the App

- Log in with the credentials above
- Add a new item from the "Items" tab using the "Add Item" button
- Edit an existing item using the "Edit" button on any row
- Delete an item using the "Delete" button (asks for confirmation first)
- Search items by name or SKU and filter them by category
- Switch to the "Low Stock Report" tab to see items that are at or below their stock threshold
- Search and filter the low-stock report by name, SKU, or category
- Click "Download PDF" on the report tab to export it as a PDF file

## Challenges Encountered

The main issue I ran into was connecting the backend to SQL Server. I needed to enable TCP/IP and use the correct server port in the backend `.env` file. At first I was using whatever dynamic port SQL Server Express had assigned, which worked, but I realized that port can change after a restart or reinstall. I ended up going into SQL Server Configuration Manager and setting a fixed port instead, so the connection stays reliable.

I also had to enable SQL Server authentication and create a login for the app, since SQL Server only trusts Windows logins by default.

At first, SSMS showed a certificate error, which was fixed by enabling "Trust Server Certificate" in the connection settings.