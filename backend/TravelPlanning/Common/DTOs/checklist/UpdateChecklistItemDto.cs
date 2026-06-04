using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs.checklist
{
    public class UpdateChecklistItemDto
    {
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
    }
}
