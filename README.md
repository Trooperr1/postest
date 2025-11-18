# Expense Tracker - Windows Forms Application

A simple and intuitive Windows Forms application for tracking personal expenses, built with C# and .NET 8.

## Features

- ✅ **DataGridView** - View all expenses in a clean, organized table
- ✅ **Add Expenses** - Easily add new expenses with date, category, amount, and description
- ✅ **Edit Expenses** - Modify existing expense entries
- ✅ **Delete Expenses** - Remove expenses with confirmation dialog
- ✅ **Total Calculation** - Automatically calculates and displays total spending
- ✅ **Category Support** - Organize expenses by: Food, Transport, Shopping, Bills, Other
- ✅ **SQLite Database** - Lightweight local database storage
- ✅ **Input Validation** - Ensures data integrity before saving

## Screenshots

### Main Window
The main form displays all expenses with columns for ID, Date, Category, Amount, and Description. The total spent is shown at the bottom right.

### Add/Edit Expense Dialog
A simple dialog with:
- **Date Picker** - Select the expense date
- **Category Dropdown** - Choose from predefined categories
- **Amount Field** - Enter the expense amount (validated)
- **Description Field** - Add notes about the expense

## Prerequisites

- **Windows OS** (Windows 10 or later recommended)
- **.NET 8.0 SDK** or later
  - Download: https://dotnet.microsoft.com/download/dotnet/8.0

## Installation & Setup

### Option 1: Run from Source (Recommended for Development)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd postest
   ```

2. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Run the application**:
   ```bash
   dotnet run
   ```

### Option 2: Using Visual Studio

1. **Install Visual Studio 2022** (Community Edition is free)
   - Download: https://visualstudio.microsoft.com/
   - Ensure ".NET desktop development" workload is installed

2. **Open the project**:
   - Double-click `ExpenseTracker.csproj`
   - OR: File → Open → Project/Solution → Select `ExpenseTracker.csproj`

3. **Run the application**:
   - Press **F5** or click the green "Start" button

### Option 3: Build a Standalone Executable

Create a self-contained executable that doesn't require .NET to be installed:

```bash
dotnet publish -c Release -r win-x64 --self-contained true -o ./publish
```

Or, if .NET 8 is already installed on the target machine:

```bash
dotnet publish -c Release -r win-x64 --self-contained false -o ./publish
```

The executable will be in the `publish` folder.

## Usage Guide

### Adding an Expense

1. Click the **"Add Expense"** button
2. Select the date using the date picker
3. Choose a category from the dropdown
4. Enter the amount (numbers only, e.g., 25.50)
5. Add an optional description
6. Click **"Save"**

### Editing an Expense

1. Select an expense row in the table
2. Click the **"Edit Expense"** button
3. Modify the fields as needed
4. Click **"Save"**

### Deleting an Expense

1. Select an expense row in the table
2. Click the **"Delete Expense"** button
3. Confirm the deletion in the dialog

### Viewing Total Spent

The total amount spent is automatically calculated and displayed in the bottom right corner as **"Total Spent: $XXX.XX"**

## Database

The application uses **SQLite** for local data storage.

### Database File
- **File Name**: `expenses.db`
- **Location**: Same folder as the application
- **Auto-Created**: The database and table are created automatically on first run

### Database Schema

**Table: Expenses**
```sql
CREATE TABLE Expenses (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Date TEXT NOT NULL,
    Category TEXT NOT NULL,
    Amount REAL NOT NULL,
    Description TEXT
)
```

### Connection String
```
Data Source=expenses.db
```

## Project Structure

```
postest/
├── ExpenseTracker.csproj          # Project file with dependencies
├── Program.cs                      # Application entry point
├── Form1.cs                        # Main form logic
├── Form1.Designer.cs               # Main form UI design
├── AddExpenseForm.cs               # Add/Edit dialog logic
├── AddExpenseForm.Designer.cs      # Add/Edit dialog UI design
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Technology Stack

- **Framework**: .NET 8.0
- **UI**: Windows Forms
- **Database**: SQLite (System.Data.SQLite.Core v1.0.118)
- **Language**: C# 12

## Code Architecture

This application follows a simple, straightforward architecture:

- **No complex patterns** - Easy to understand and modify
- **Direct SQL commands** - No Entity Framework or ORM
- **Two forms** - Main window (Form1) and Add/Edit dialog (AddExpenseForm)
- **Clear comments** - Every section is well-documented
- **Basic error handling** - User-friendly MessageBox alerts

### Key Files

- **Form1.cs:42** - Database initialization
- **Form1.cs:66** - Load expenses into DataGridView
- **Form1.cs:97** - Calculate total spent
- **Form1.cs:145** - Add expense button handler
- **Form1.cs:157** - Edit expense button handler
- **Form1.cs:189** - Delete expense button handler
- **AddExpenseForm.cs:89** - Input validation
- **AddExpenseForm.cs:115** - Add expense to database
- **AddExpenseForm.cs:144** - Update existing expense

## Troubleshooting

### Issue: "dotnet: command not found"
**Solution**: Install .NET 8 SDK from https://dotnet.microsoft.com/download/dotnet/8.0

### Issue: SQLite package not found
**Solution**: Run `dotnet restore` to download dependencies

### Issue: Database file is locked
**Solution**: Close all instances of the application before reopening

### Issue: Can't parse amount value
**Solution**: Enter only numbers and decimal points (e.g., 25.50, not $25.50)

## Future Enhancements

Potential features to add:

- [ ] Export expenses to CSV/Excel
- [ ] Date range filtering
- [ ] Category-based reports and charts
- [ ] Search functionality
- [ ] Budget tracking and alerts
- [ ] Multiple currency support
- [ ] Data backup and restore

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

This project is open source and available for educational and personal use.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Built with ❤️ using C# and Windows Forms**
