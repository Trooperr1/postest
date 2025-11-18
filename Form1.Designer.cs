namespace ExpenseTracker
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.dataGridViewExpenses = new System.Windows.Forms.DataGridView();
            this.btnAddExpense = new System.Windows.Forms.Button();
            this.btnEditExpense = new System.Windows.Forms.Button();
            this.btnDeleteExpense = new System.Windows.Forms.Button();
            this.lblTotalSpent = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewExpenses)).BeginInit();
            this.SuspendLayout();
            //
            // dataGridViewExpenses
            //
            this.dataGridViewExpenses.AllowUserToAddRows = false;
            this.dataGridViewExpenses.AllowUserToDeleteRows = false;
            this.dataGridViewExpenses.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dataGridViewExpenses.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridViewExpenses.Location = new System.Drawing.Point(12, 12);
            this.dataGridViewExpenses.MultiSelect = false;
            this.dataGridViewExpenses.Name = "dataGridViewExpenses";
            this.dataGridViewExpenses.ReadOnly = true;
            this.dataGridViewExpenses.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridViewExpenses.Size = new System.Drawing.Size(760, 350);
            this.dataGridViewExpenses.TabIndex = 0;
            //
            // btnAddExpense
            //
            this.btnAddExpense.Location = new System.Drawing.Point(12, 380);
            this.btnAddExpense.Name = "btnAddExpense";
            this.btnAddExpense.Size = new System.Drawing.Size(120, 35);
            this.btnAddExpense.TabIndex = 1;
            this.btnAddExpense.Text = "Add Expense";
            this.btnAddExpense.UseVisualStyleBackColor = true;
            this.btnAddExpense.Click += new System.EventHandler(this.btnAddExpense_Click);
            //
            // btnEditExpense
            //
            this.btnEditExpense.Location = new System.Drawing.Point(150, 380);
            this.btnEditExpense.Name = "btnEditExpense";
            this.btnEditExpense.Size = new System.Drawing.Size(120, 35);
            this.btnEditExpense.TabIndex = 2;
            this.btnEditExpense.Text = "Edit Expense";
            this.btnEditExpense.UseVisualStyleBackColor = true;
            this.btnEditExpense.Click += new System.EventHandler(this.btnEditExpense_Click);
            //
            // btnDeleteExpense
            //
            this.btnDeleteExpense.Location = new System.Drawing.Point(288, 380);
            this.btnDeleteExpense.Name = "btnDeleteExpense";
            this.btnDeleteExpense.Size = new System.Drawing.Size(120, 35);
            this.btnDeleteExpense.TabIndex = 3;
            this.btnDeleteExpense.Text = "Delete Expense";
            this.btnDeleteExpense.UseVisualStyleBackColor = true;
            this.btnDeleteExpense.Click += new System.EventHandler(this.btnDeleteExpense_Click);
            //
            // lblTotalSpent
            //
            this.lblTotalSpent.AutoSize = true;
            this.lblTotalSpent.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.lblTotalSpent.Location = new System.Drawing.Point(550, 387);
            this.lblTotalSpent.Name = "lblTotalSpent";
            this.lblTotalSpent.Size = new System.Drawing.Size(150, 21);
            this.lblTotalSpent.TabIndex = 4;
            this.lblTotalSpent.Text = "Total Spent: $0.00";
            //
            // Form1
            //
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 431);
            this.Controls.Add(this.lblTotalSpent);
            this.Controls.Add(this.btnDeleteExpense);
            this.Controls.Add(this.btnEditExpense);
            this.Controls.Add(this.btnAddExpense);
            this.Controls.Add(this.dataGridViewExpenses);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Expense Tracker";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewExpenses)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.DataGridView dataGridViewExpenses;
        private System.Windows.Forms.Button btnAddExpense;
        private System.Windows.Forms.Button btnEditExpense;
        private System.Windows.Forms.Button btnDeleteExpense;
        private System.Windows.Forms.Label lblTotalSpent;
    }
}
