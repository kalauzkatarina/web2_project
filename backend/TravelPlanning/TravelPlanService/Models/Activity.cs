using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Models
{
    public class Activity
    {
        public Activity()
        {
        }

        public Activity(Guid id, Guid destinationId, string title, string location, string description, double estimatedCost, DateTime date, string time, ActivityStatus status, ExpenseCategory category) : this()
        {
            Id = id;
            DestinationId = destinationId;
            Title = title;
            Location = location;
            Description = description;
            EstimatedCost = estimatedCost;
            Date = date;
            Time = time;
            Status = status;
            Category = category;
        }

        public Guid Id { get; set; }
        public Guid DestinationId { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public double EstimatedCost { get; set; }
        public DateTime Date { get; set; } //za calendar view 
        public string Time { get; set; } //za calendar view
        public ActivityStatus Status { get; set; }
        public ExpenseCategory Category { get; set; }
    }
}
