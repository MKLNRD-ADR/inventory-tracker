# Inventory Tracker

A simple inventory management system built for a technical assessment. It lets you log in, manage stock items (add, edit, delete), and view a low-stock report that can also be downloaded as a PDF.

## Tech Stack
- Frontend: React (Vite) + Ant Design
- Backend: Express.js
- Database: MSSQL
- Auth: JWT + bcrypt

## Prerequisites
- Node.js (LTS)
- SQL Server Express (or any MSSQL instance), with an instance name matching your `.env` config
- SSMS or another way to run SQL scripts (optional but helpful)

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/MKLNRD-ADR/inventory-tracker.git
cd inventory-tracker
```

### 2. Database setup
Run the SQL in `database/schema.sql` against your MSSQL instance. This creates the `Users` and `Items` tables inside a database called `InventoryTrackerDB`.

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
DB_SERVER=localhost\SQLEXPRESS
DB_DATABASE=InventoryTrackerDB
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
JWT_SECRET=your_random_secret
PORT=5000
```

Note: if your MSSQL instance isn't named `SQLEXPRESS`, update `DB_SERVER` to match your own instance name.

Start the backend server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 4. Frontend setup

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
- Switch to the "Low Stock Report" tab to see items that are at or below their stock threshold
- Click "Download PDF" on the report tab to export it as a PDF file

## Challenges Encountered

Biggest headache was the MSSQL connection. Turns out SQL Server Express doesn't use a fixed port, it picks a random one, and something called SQL Server Browser figures out which port to use based on the instance name. Took me a while to understand why my connection string worked without me putting a port anywhere in it.

SSMS also wouldn't connect at first, kept throwing a certificate error, until I checked "Trust Server Certificate" in the connection settings.

Then when I tried hooking up Node to the database, I realized SQL Server only trusts Windows logins by default. My backend needed an actual username and password to connect. Had to go dig through server settings, switch it to "mixed mode" auth, and make a separate SQL login just for the app.

Small but annoying one: I'm used to Command Prompt, so `type nul >` (how I usually make an empty file quickly) didn't work in VS Code's terminal since it defaults to PowerShell. Had to use `New-Item` instead.

Also somehow created my frontend folder in the wrong place at one point. My terminal had cd'd up a level without me realizing, so `npm create vite` ran outside the project folder. Had to move it back in manually.

Everything else, login, CRUD, the report, was pretty straightforward once the environment was actually working.