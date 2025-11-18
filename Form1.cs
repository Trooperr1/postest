using System.Data;
using System.Data.SQLite;

namespace ExpenseTracker
{
    public partial class Form1 : Form
    {
        // Database connection string
        private const string ConnectionString = "Data Source=expenses.db";

        public Form1()
        {
            InitializeComponent();
        }

        // Called when the form loads
        private void Form1_Load(object sender, EventArgs e)
        {
            // Initialize database and create table if it doesn't exist
            InitializeDatabase();

            // Load all expenses into the DataGridView
            LoadExpenses();
        }

        #region Database Methods

        // Creates the database and Expenses table if they don't exist
        private void InitializeDatabase()
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string createTableQuery = @"
                        CREATE TABLE IF NOT EXISTS Expenses (
                            Id INTEGER PRIMARY KEY AUTOINCREMENT,
                            Date TEXT NOT NULL,
                            Category TEXT NOT NULL,
                            Amount REAL NOT NULL,
                            Description TEXT
                        )";

                    using (var command = new SQLiteCommand(createTableQuery, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error initializing database: {ex.Message}",
                    "Database Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Loads all expenses from the database and displays them in the DataGridView
        private void LoadExpenses()
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string query = "SELECT Id, Date, Category, Amount, Description FROM Expenses ORDER BY Date DESC";

                    using (var adapter = new SQLiteDataAdapter(query, connection))
                    {
                        DataTable dataTable = new DataTable();
                        adapter.Fill(dataTable);

                        // Bind the data to the DataGridView
                        dataGridViewExpenses.DataSource = dataTable;

                        // Format the Amount column to show currency
                        if (dataGridViewExpenses.Columns["Amount"] != null)
                        {
                            dataGridViewExpenses.Columns["Amount"].DefaultCellStyle.Format = "C2";
                        }
                    }
                }

                // Update the total spent label
                UpdateTotalSpent();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading expenses: {ex.Message}",
                    "Database Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Calculates and displays the total amount spent
        private void UpdateTotalSpent()
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string query = "SELECT SUM(Amount) FROM Expenses";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        object result = command.ExecuteScalar();
                        decimal total = result != DBNull.Value && result != null
                            ? Convert.ToDecimal(result)
                            : 0;

                        lblTotalSpent.Text = $"Total Spent: {total:C2}";
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error calculating total: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Deletes an expense from the database by ID
        private void DeleteExpense(int expenseId)
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string query = "DELETE FROM Expenses WHERE Id = @Id";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", expenseId);
                        command.ExecuteNonQuery();
                    }
                }

                MessageBox.Show("Expense deleted successfully!",
                    "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error deleting expense: {ex.Message}",
                    "Database Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion

        #region Button Click Events

        // Opens the Add Expense form
        private void btnAddExpense_Click(object sender, EventArgs e)
        {
            AddExpenseForm addForm = new AddExpenseForm();

            if (addForm.ShowDialog() == DialogResult.OK)
            {
                // Reload the expenses after adding a new one
                LoadExpenses();
            }
        }

        // Opens the Edit Expense form with the selected expense data
        private void btnEditExpense_Click(object sender, EventArgs e)
        {
            // Check if a row is selected
            if (dataGridViewExpenses.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select an expense to edit.",
                    "No Selection", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Get the selected row
            DataGridViewRow selectedRow = dataGridViewExpenses.SelectedRows[0];

            // Extract expense data from the selected row
            int id = Convert.ToInt32(selectedRow.Cells["Id"].Value);
            string date = selectedRow.Cells["Date"].Value.ToString() ?? string.Empty;
            string category = selectedRow.Cells["Category"].Value.ToString() ?? string.Empty;
            decimal amount = Convert.ToDecimal(selectedRow.Cells["Amount"].Value);
            string description = selectedRow.Cells["Description"].Value?.ToString() ?? string.Empty;

            // Open the Add/Edit form in edit mode
            AddExpenseForm editForm = new AddExpenseForm(id, date, category, amount, description);

            if (editForm.ShowDialog() == DialogResult.OK)
            {
                // Reload the expenses after editing
                LoadExpenses();
            }
        }

        // Deletes the selected expense
        private void btnDeleteExpense_Click(object sender, EventArgs e)
        {
            // Check if a row is selected
            if (dataGridViewExpenses.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select an expense to delete.",
                    "No Selection", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Confirm deletion
            DialogResult result = MessageBox.Show(
                "Are you sure you want to delete this expense?",
                "Confirm Delete",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                // Get the ID of the selected expense
                int id = Convert.ToInt32(dataGridViewExpenses.SelectedRows[0].Cells["Id"].Value);

                // Delete the expense from the database
                DeleteExpense(id);

                // Reload the expenses
                LoadExpenses();
            }
        }

        #endregion
    }
}
