using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.travelPlan
{
    public class UpdateActivityDto
    {
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public double EstimatedCost { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public ActivityStatus Status { get; set; }
        public ExpenseCategory Category { get; set; }
    }
}
