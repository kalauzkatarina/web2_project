using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.finance
{
    public class BudgetSummaryDto
    {
        public Guid PlanId { get; set; }
        public double PlannedBudget { get; set; } //dolazi iz TravelPlanService
        public double TotalExpenses { get; set; } //suma svih troskova
        public double RemainingBudget { get; set; } //PlannedBudget - TotalExpenses
    }
}
