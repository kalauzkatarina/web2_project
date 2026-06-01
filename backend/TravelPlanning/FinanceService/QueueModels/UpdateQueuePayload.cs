using Common.DTOs.finance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.QueueModels
{
    //za add ne treba nista jer ima vec dto za add, za delete terba samo id
    //ali za update treba id i dto
    public class UpdateQueuePayload
    {
        public Guid ExpenseId { get; set; }
        public UpdateExpenseDto Dto { get; set; }
    }
}
