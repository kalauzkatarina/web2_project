using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPlanService.Models
{
    public class TravelPlan
    {
        public TravelPlan()
        {
        }

        //.this() treba jer sa njim se osigura da se lista Destionations uvek inicijalizuje (preko praznog konstruktora)
        public TravelPlan(Guid id, Guid userId, string title, string description, DateTime startDate, DateTime endDate, double plannedBudget, string generalNotes) : this()
        {
            Id = id;
            UserId = userId;
            Title = title;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            PlannedBudget = plannedBudget;
            GeneralNotes = generalNotes;
            CreatedAt = DateTime.Now;
        }

        public Guid Id { get; set; }
        public Guid UserId { get; set; } //poveznica sa user servisom
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double PlannedBudget { get; set; }
        public string GeneralNotes { get; set; }
        public DateTime CreatedAt {  get; set; } = DateTime.Now;    
        public List<Destination> Destinations { get; set; } = new List<Destination>();
    }
}
