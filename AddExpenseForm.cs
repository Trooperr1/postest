using System.Data.SQLite;

namespace ExpenseTracker
{
    public partial class AddExpenseForm : Form
    {
        // Database connection string
        private const string ConnectionString = "Data Source=expenses.db";

        // Fields to track if we're editing an existing expense
        private bool isEditMode = false;
        private int expenseId = 0;

        // Constructor for adding a new expense
        public AddExpenseForm()
        {
            InitializeComponent();
            isEditMode = false;

            // Set default values
            datePickerExpense.Value = DateTime.Now;
            cmbCategory.SelectedIndex = 0; // Select first category by default
        }

        // Constructor for editing an existing expense
        public AddExpenseForm(int id, string date, string category, decimal amount, string description)
        {
            InitializeComponent();
            isEditMode = true;
            expenseId = id;

            // Change the form title to indicate edit mode
            this.Text = "Edit Expense";

            // Populate the form fields with existing data
            datePickerExpense.Value = DateTime.Parse(date);
            cmbCategory.SelectedItem = category;
            txtAmount.Text = amount.ToString("F2");
            txtDescription.Text = description;
        }

        // Save button click event
        private void btnSave_Click(object sender, EventArgs e)
        {
            // Validate input fields
            if (!ValidateInput())
            {
                return;
            }

            // Save or update the expense based on the mode
            if (isEditMode)
            {
                UpdateExpense();
            }
            else
            {
                AddExpense();
            }

            // Close the form with OK result
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        // Cancel button click event
        private void btnCancel_Click(object sender, EventArgs e)
        {
            // Close the form without saving
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        #region Validation

        // Validates all input fields before saving
        private bool ValidateInput()
        {
            // Check if category is selected
            if (cmbCategory.SelectedIndex == -1)
            {
                MessageBox.Show("Please select a category.",
                    "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                cmbCategory.Focus();
                return false;
            }

            // Check if amount is entered and valid
            if (string.IsNullOrWhiteSpace(txtAmount.Text))
            {
                MessageBox.Show("Please enter an amount.",
                    "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtAmount.Focus();
                return false;
            }

            // Try to parse the amount as a decimal
            if (!decimal.TryParse(txtAmount.Text, out decimal amount) || amount <= 0)
            {
                MessageBox.Show("Please enter a valid positive amount.",
                    "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtAmount.Focus();
                return false;
            }

            return true;
        }

        #endregion

        #region Database Operations

        // Adds a new expense to the database
        private void AddExpense()
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string query = @"
                        INSERT INTO Expenses (Date, Category, Amount, Description)
                        VALUES (@Date, @Category, @Amount, @Description)";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        // Add parameters to prevent SQL injection
                        command.Parameters.AddWithValue("@Date", datePickerExpense.Value.ToString("yyyy-MM-dd"));
                        command.Parameters.AddWithValue("@Category", cmbCategory.SelectedItem.ToString());
                        command.Parameters.AddWithValue("@Amount", decimal.Parse(txtAmount.Text));
                        command.Parameters.AddWithValue("@Description", txtDescription.Text);

                        command.ExecuteNonQuery();
                    }
                }

                MessageBox.Show("Expense added successfully!",
                    "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error adding expense: {ex.Message}",
                    "Database Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // Updates an existing expense in the database
        private void UpdateExpense()
        {
            try
            {
                using (var connection = new SQLiteConnection(ConnectionString))
                {
                    connection.Open();

                    string query = @"
                        UPDATE Expenses
                        SET Date = @Date,
                            Category = @Category,
                            Amount = @Amount,
                            Description = @Description
                        WHERE Id = @Id";

                    using (var command = new SQLiteCommand(query, connection))
                    {
                        // Add parameters to prevent SQL injection
                        command.Parameters.AddWithValue("@Date", datePickerExpense.Value.ToString("yyyy-MM-dd"));
                        command.Parameters.AddWithValue("@Category", cmbCategory.SelectedItem.ToString());
                        command.Parameters.AddWithValue("@Amount", decimal.Parse(txtAmount.Text));
                        command.Parameters.AddWithValue("@Description", txtDescription.Text);
                        command.Parameters.AddWithValue("@Id", expenseId);

                        command.ExecuteNonQuery();
                    }
                }

                MessageBox.Show("Expense updated successfully!",
                    "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error updating expense: {ex.Message}",
                    "Database Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion
    }
}
