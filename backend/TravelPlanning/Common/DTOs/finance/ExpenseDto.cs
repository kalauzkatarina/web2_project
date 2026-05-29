using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.finance
{
    public class ExpenseDto
    {
        public Guid Id { get; set; }
        public Guid PlanId { get; set; }
        public string Title { get; set; }
        public double Amount { get; set; }
        public ExpenseCategory Category { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
