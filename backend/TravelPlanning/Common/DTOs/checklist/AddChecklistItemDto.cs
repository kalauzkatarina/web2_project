using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.checklist
{
    public class AddChecklistItemDto
    {
        public Guid PlanId { get; set; }
        public string Title { get; set; }
    }
}
