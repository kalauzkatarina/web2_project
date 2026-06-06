using ChecklistService.Models;
using Common.DTOs.checklist;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChecklistService.Mappers
{
    public static class ChecklistMapper
    {
        public static ChecklistItemDto ToDto(ChecklistItem item)
        {
            return new ChecklistItemDto
            {
                Id = item.Id,
                PlanId = item.PlanId,
                Title = item.Title,
                IsCompleted = item.IsCompleted,
                CreatedAt = item.CreatedAt
            };
        }
    }
}
