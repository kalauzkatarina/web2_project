using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.Models
{
    public class Expense
    {
        public Expense() { }

        public Expense(Guid id, Guid planId, string title, double amount, ExpenseCategory category, DateTime date, string description)
        {
            Id = id;
            PlanId = planId;
            Title = title;
            Amount = amount;
            Category = category;
            Date = date;
            Description = description;
            CreatedAt = DateTime.Now;
        }

        public Guid Id { get; set; }
        public Guid PlanId { get; set; }
        public string Title { get; set; }
        public double Amount { get; set; }
        public ExpenseCategory Category { get; set; }
        public DateTime Date {  get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
