using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceService.QueueModels
{
    public class ExpenseQueueItem
    {
        public Guid UserId { get; set; }
        public ExpenseOperationType OperationType { get; set; }
        public string Payload { get; set; }
    }
}
