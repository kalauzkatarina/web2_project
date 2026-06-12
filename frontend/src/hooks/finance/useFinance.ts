import { useState, useEffect } from "react";
import { financeService } from "../../api_services/financeApi/FinanceApiService";
import type { ExpenseDto } from "../../models/finance/ExpenseDto";
import type { BudgetSummaryDto } from "../../models/finance/BudgetSummaryDto";

export function useFinance(planId: string | undefined) {
  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [summary, setSummary] = useState<BudgetSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!planId) return;
    try {
      const [expensesData, summaryData] = await Promise.all([
        financeService.getByPlan(planId),
        financeService.getSummary(planId),
      ]);
      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [planId]);

  return { expenses, summary, loading, refetch: fetchData };
}