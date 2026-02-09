import { Breadcrumbs } from '@workpace/design-system'
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

import styles from './BudgetBot.module.scss'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

interface ExpenseItem {
  id: string
  name: string
  amount: number
}

interface SavingsItem {
  id: string
  name: string
  amount: number
}

interface ReserveItem {
  id: string
  name: string
  amount: number
}

interface DebtItem {
  id: string
  name: string
  amount: number
}

export const BudgetBot = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [savings, setSavings] = useState<SavingsItem[]>([])
  const [emergencyFundMonths, setEmergencyFundMonths] = useState<number>(6)
  const [emergencyFundMonthsInput, setEmergencyFundMonthsInput] = useState<string>('6')
  const [currentEmergencyFund, setCurrentEmergencyFund] = useState<number>(0)
  const [debts, setDebts] = useState<DebtItem[]>([])
  const [otherReserves, setOtherReserves] = useState<ReserveItem[]>([])

  const addExpense = () => {
    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    setExpenses([...expenses, newExpense])
  }

  const updateExpense = (id: string, field: 'name' | 'amount', value: string | number) => {
    setExpenses(
      expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense))
    )
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const addSavings = () => {
    const newSavings: SavingsItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    setSavings([...savings, newSavings])
  }

  const updateSavings = (id: string, field: 'name' | 'amount', value: string | number) => {
    setSavings(savings.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeSavings = (id: string) => {
    setSavings(savings.filter((item) => item.id !== id))
  }

  const addReserve = () => {
    const newReserve: ReserveItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    setOtherReserves([...otherReserves, newReserve])
  }

  const updateReserve = (id: string, field: 'name' | 'amount', value: string | number) => {
    setOtherReserves(
      otherReserves.map((reserve) => (reserve.id === id ? { ...reserve, [field]: value } : reserve))
    )
  }

  const removeReserve = (id: string) => {
    setOtherReserves(otherReserves.filter((reserve) => reserve.id !== id))
  }

  const addDebt = () => {
    const newDebt: DebtItem = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    setDebts([...debts, newDebt])
  }

  const updateDebt = (id: string, field: 'name' | 'amount', value: string | number) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)))
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const totalSavings = savings.reduce((sum, item) => sum + (item.amount || 0), 0)
  const remainingForWants = monthlyIncome - totalExpenses - totalSavings

  const expensesPercentage = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0
  const savingsPercentage = monthlyIncome > 0 ? (totalSavings / monthlyIncome) * 100 : 0
  const wantsPercentage = monthlyIncome > 0 ? (remainingForWants / monthlyIncome) * 100 : 0

  // Emergency Fund Calculations
  const emergencyFundGoal = totalExpenses * emergencyFundMonths
  const emergencyFundProgress =
    emergencyFundGoal > 0 ? Math.min(100, (currentEmergencyFund / emergencyFundGoal) * 100) : 0
  const emergencyFundRemaining = Math.max(0, emergencyFundGoal - currentEmergencyFund)
  const hasExceededGoal = currentEmergencyFund > emergencyFundGoal && totalExpenses > 0

  // Calculate months of security when exceeded
  const monthsOfSecurity = totalExpenses > 0 ? currentEmergencyFund / totalExpenses : 0
  const formatMonthsOfSecurity = (months: number): string => {
    if (months < 1) return '0 mo.'
    const totalMonths = Math.floor(months)
    const years = Math.floor(totalMonths / 12)
    const remainingMonths = totalMonths % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years} yr. ${remainingMonths} mo.`
    } else if (years > 0) {
      return `${years} yr.`
    } else {
      return `${totalMonths} mo.`
    }
  }

  // Net Worth Calculation
  const totalOtherReserves = otherReserves.reduce((sum, reserve) => sum + (reserve.amount || 0), 0)
  const totalDebts = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0)
  const netWorth = currentEmergencyFund + totalOtherReserves - totalDebts

  // Chart data for emergency fund
  const emergencyFundChartData = useMemo(() => {
    if (emergencyFundGoal === 0) {
      return {
        labels: ['No Goal Set'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e5e7eb'],
            borderColor: ['#d1d5db'],
            borderWidth: 2,
          },
        ],
      }
    }

    if (hasExceededGoal) {
      // When exceeded, show full green circle (100% complete)
      return {
        labels: ['Emergency Fund Goal'],
        datasets: [
          {
            data: [emergencyFundGoal],
            backgroundColor: ['#4ade80'],
            borderColor: ['#22c55e'],
            borderWidth: 2,
          },
        ],
      }
    }

    const remaining = Math.max(0, emergencyFundGoal - currentEmergencyFund)
    return {
      labels: ['Current Emergency Fund', 'Remaining to Goal'],
      datasets: [
        {
          data: [currentEmergencyFund, remaining],
          backgroundColor: ['#4ade80', '#e5e7eb'],
          borderColor: ['#22c55e', '#d1d5db'],
          borderWidth: 2,
        },
      ],
    }
  }, [currentEmergencyFund, emergencyFundGoal, hasExceededGoal])

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrapper}>
        <Breadcrumbs
          linkAs={Link}
          items={[
            { label: 'Apps', href: '/apps' },
            { label: 'Budget Bot' },
          ]}
          size="sm"
        />
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>💰 Budget Bot</h1>
        <p className={styles.subtitle}>
          Understand your financial levers and set goals for improving your finances
        </p>
      </div>

      {/* Reserves Section */}
      <div className={styles.reservesCard}>
        <div className={styles.cardHeader}>
          <h2>🏦 Reserves & Net Worth</h2>
        </div>
        <div className={styles.reservesContent}>
          {/* Emergency Fund Section */}
          <div className={styles.emergencyFundSection}>
            <div className={styles.emergencyFundHeader}>
              <h3>Emergency Fund</h3>
              <div className={styles.emergencyFundGoal}>
                <label htmlFor="emergency-months">Target: </label>
                <input
                  id="emergency-months"
                  type="number"
                  min="1"
                  max="24"
                  value={emergencyFundMonthsInput}
                  onChange={(e) => {
                    const val = e.target.value
                    setEmergencyFundMonthsInput(val)
                    const num = parseInt(val, 10)
                    if (!isNaN(num) && num >= 1 && num <= 24) {
                      setEmergencyFundMonths(num)
                    }
                  }}
                  onBlur={(e) => {
                    const num = parseInt(e.target.value, 10)
                    if (isNaN(num) || num < 1) {
                      setEmergencyFundMonthsInput('1')
                      setEmergencyFundMonths(1)
                    } else if (num > 24) {
                      setEmergencyFundMonthsInput('24')
                      setEmergencyFundMonths(24)
                    } else {
                      setEmergencyFundMonthsInput(num.toString())
                      setEmergencyFundMonths(num)
                    }
                  }}
                  className={styles.monthsInput}
                />
                <span> months of expenses</span>
              </div>
            </div>
            <div className={styles.emergencyFundDetails}>
              <div className={styles.chartContainer}>
                <Doughnut
                  data={emergencyFundChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `$${context.parsed.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          },
                        },
                      },
                    },
                    cutout: '70%',
                  }}
                />
                {emergencyFundGoal > 0 && (
                  <div className={styles.chartCenter}>
                    {hasExceededGoal ? (
                      <>
                        <div className={styles.chartCenterValue}>
                          {formatMonthsOfSecurity(monthsOfSecurity)}
                        </div>
                        <div className={styles.chartCenterLabel}>of Security</div>
                      </>
                    ) : (
                      <>
                        <div className={styles.chartCenterValue}>
                          {emergencyFundProgress.toFixed(1)}%
                        </div>
                        <div className={styles.chartCenterLabel}>Complete</div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.emergencyFundStats}>
                <div className={styles.statRow}>
                  <span>Goal:</span>
                  <span className={styles.statValue}>${emergencyFundGoal.toFixed(2)}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Current:</span>
                  <div className={styles.currencyInput}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentEmergencyFund || ''}
                      onChange={(e) => setCurrentEmergencyFund(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.statRow}>
                  <span>Remaining:</span>
                  <span className={styles.statValue}>${emergencyFundRemaining.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Debts Section */}
          <div className={styles.debtsSection}>
            <div className={styles.debtsHeader}>
              <h3>Debts</h3>
              <button onClick={addDebt} className={styles.addButton}>
                + Add Debt
              </button>
            </div>
            <div className={styles.debtsList}>
              {debts.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No debts added yet. Click &quot;Add Debt&quot; to get started.</p>
                </div>
              ) : (
                debts.map((debt) => (
                  <div key={debt.id} className={styles.itemRow}>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      placeholder="Debt name (e.g., Credit Card, Student Loan)"
                      className={styles.nameInput}
                    />
                    <div className={styles.currencyInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={debt.amount || ''}
                        onChange={(e) =>
                          updateDebt(debt.id, 'amount', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                        className={styles.amountInput}
                      />
                    </div>
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className={styles.removeButton}
                      aria-label="Remove debt"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {debts.length > 0 && (
              <div className={styles.total}>
                <span>Total Debts:</span>
                <span className={styles.totalDebtAmount}>${totalDebts.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Other Reserves Section */}
          <div className={styles.otherReservesSection}>
            <div className={styles.otherReservesHeader}>
              <h3>Other Reserves</h3>
              <button onClick={addReserve} className={styles.addButton}>
                + Add Reserve
              </button>
            </div>
            <div className={styles.reservesList}>
              {otherReserves.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No other reserves added yet. Click &quot;Add Reserve&quot; to get started.</p>
                </div>
              ) : (
                otherReserves.map((reserve) => (
                  <div key={reserve.id} className={styles.itemRow}>
                    <input
                      type="text"
                      value={reserve.name}
                      onChange={(e) => updateReserve(reserve.id, 'name', e.target.value)}
                      placeholder="Reserve name (e.g., 401k, AFT Brokerage)"
                      className={styles.nameInput}
                    />
                    <div className={styles.currencyInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={reserve.amount || ''}
                        onChange={(e) =>
                          updateReserve(reserve.id, 'amount', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                        className={styles.amountInput}
                      />
                    </div>
                    <button
                      onClick={() => removeReserve(reserve.id)}
                      className={styles.removeButton}
                      aria-label="Remove reserve"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {otherReserves.length > 0 && (
              <div className={styles.total}>
                <span>Total Other Reserves:</span>
                <span className={styles.totalAmount}>${totalOtherReserves.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Net Worth Display */}
          <div className={styles.netWorthSection}>
            <div className={styles.netWorthLabel}>Total Net Worth:</div>
            <div className={styles.netWorthValue}>${netWorth.toFixed(2)}</div>
            <div className={styles.netWorthBreakdown}>
              <div className={styles.netWorthItem}>
                <span>Emergency Fund:</span>
                <span>${currentEmergencyFund.toFixed(2)}</span>
              </div>
              <div className={styles.netWorthItem}>
                <span>Other Reserves:</span>
                <span>${totalOtherReserves.toFixed(2)}</span>
              </div>
              {totalDebts > 0 && (
                <div className={styles.netWorthItem}>
                  <span>Debts:</span>
                  <span>-${totalDebts.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Income Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>💵 Monthly Income</h2>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="income">Net Monthly Income</label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>$</span>
              <input
                id="income"
                type="number"
                min="0"
                step="0.01"
                value={monthlyIncome || ''}
                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>🏠 Needed Expenses</h2>
            <button onClick={addExpense} className={styles.addButton}>
              + Add Expense
            </button>
          </div>
          <div className={styles.itemsList}>
            {expenses.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No expenses added yet. Click &quot;Add Expense&quot; to get started.</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className={styles.itemRow}>
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    placeholder="Expense name (e.g., Rent, Groceries)"
                    className={styles.nameInput}
                  />
                  <div className={styles.currencyInput}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={expense.amount || ''}
                      onChange={(e) =>
                        updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className={styles.amountInput}
                    />
                  </div>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className={styles.removeButton}
                    aria-label="Remove expense"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          {expenses.length > 0 && (
            <div className={styles.total}>
              <span>Total Expenses:</span>
              <div className={styles.totalAmountGroup}>
                <span className={styles.totalAmount}>${totalExpenses.toFixed(2)}</span>
                {monthlyIncome > 0 && (
                  <span className={styles.percentage}>({expensesPercentage.toFixed(1)}%)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Savings Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>💎 Savings & Investments</h2>
            <button onClick={addSavings} className={styles.addButton}>
              + Add Savings
            </button>
          </div>
          <div className={styles.itemsList}>
            {savings.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No savings items added yet. Click &quot;Add Savings&quot; to get started.</p>
              </div>
            ) : (
              savings.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateSavings(item.id, 'name', e.target.value)}
                    placeholder="Savings name (e.g., Roth IRA, Emergency Fund)"
                    className={styles.nameInput}
                  />
                  <div className={styles.currencyInput}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amount || ''}
                      onChange={(e) =>
                        updateSavings(item.id, 'amount', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className={styles.amountInput}
                    />
                  </div>
                  <button
                    onClick={() => removeSavings(item.id)}
                    className={styles.removeButton}
                    aria-label="Remove savings item"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          {savings.length > 0 && (
            <div className={styles.total}>
              <span>Total Savings:</span>
              <div className={styles.totalAmountGroup}>
                <span className={styles.totalAmount}>${totalSavings.toFixed(2)}</span>
                {monthlyIncome > 0 && (
                  <span className={styles.percentage}>({savingsPercentage.toFixed(1)}%)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wants Display Section */}
        <div className={styles.wantsCard}>
          <div className={styles.cardHeader}>
            <h2>🎯 Available for Wants</h2>
          </div>
          <div className={styles.wantsDisplay}>
            <div className={styles.wantsAmount}>
              <div className={styles.wantsAmountValue}>${remainingForWants.toFixed(2)}</div>
              {monthlyIncome > 0 && (
                <div className={styles.wantsAmountPercentage}>
                  ({wantsPercentage.toFixed(1)}% of income)
                </div>
              )}
            </div>
            <div className={styles.wantsBreakdown}>
              <div className={styles.breakdownRow}>
                <span>Monthly Income:</span>
                <span className={styles.breakdownValue}>${monthlyIncome.toFixed(2)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Total Expenses:</span>
                <div className={styles.breakdownValueGroup}>
                  <span className={styles.breakdownValue}>-${totalExpenses.toFixed(2)}</span>
                  {monthlyIncome > 0 && (
                    <span className={styles.breakdownPercentage}>
                      ({expensesPercentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.breakdownRow}>
                <span>Total Savings:</span>
                <div className={styles.breakdownValueGroup}>
                  <span className={styles.breakdownValue}>-${totalSavings.toFixed(2)}</span>
                  {monthlyIncome > 0 && (
                    <span className={styles.breakdownPercentage}>
                      ({savingsPercentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.breakdownDivider}></div>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>Remaining for Wants:</span>
                <div className={styles.breakdownValueGroup}>
                  <span
                    className={`${styles.breakdownValue} ${remainingForWants >= 0 ? styles.positive : styles.negative
                      }`}
                  >
                    ${remainingForWants.toFixed(2)}
                  </span>
                  {monthlyIncome > 0 && (
                    <span
                      className={`${styles.breakdownPercentage} ${remainingForWants >= 0 ? styles.positive : styles.negative
                        }`}
                    >
                      ({wantsPercentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
            {remainingForWants < 0 && (
              <div className={styles.warning}>
                ⚠️ You&apos;re spending more than you earn. Consider adjusting your expenses or
                savings.
              </div>
            )}
            {remainingForWants >= 0 && remainingForWants < 100 && (
              <div className={styles.info}>
                💡 You have a small amount left for wants. Consider reviewing your expenses.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
