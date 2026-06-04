using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Models
{
    public class ChecklistItem
    {
        public ChecklistItem() { }

        public ChecklistItem(Guid id, Guid planId, string title, bool isCompleted)
        {
            Id = id;
            PlanId = planId;
            Title = title;
            IsCompleted = isCompleted;
            CreatedAt = DateTime.Now;
        }

        public Guid Id { get; set; }
        public Guid PlanId {  get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime CreatedAt {  get; set; } = DateTime.Now;
    }
}
