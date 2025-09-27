import styles from './PaymentAnalyticsTabContent.module.css';

function PaymentAnalyticsTabContent({ paymentAnalytics }) {
  const { payment_status_distribution, overdue_payments, upcoming_payments, monthly_revenue  } = paymentAnalytics;
  return (
   <>
     <div className={styles.analyticsGrid}>
      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Payment Status Distribution</h1>
        <div className={styles.statusList}>
          <div className={styles.statusRow}>
            <span>Completed</span>
            <span className={styles.completed}>{payment_status_distribution?.done ?? 0}</span>
          </div>
          <div className={styles.statusRow}>
            <span>Pending</span>
            <span className={styles.pending}>{payment_status_distribution?.pending ?? 0}</span>
          </div>
          <div className={styles.statusRow}>
            <span>Overdue</span>
            <span className={styles.overdue}>{payment_status_distribution?.overdue ?? 0}</span>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Monthly Revenue</h1>
        <div className={styles.monthlyRevenueList}>
          {monthly_revenue && Object.entries(monthly_revenue).map(([month, amount]) => (
            <div key={month} className={styles.monthlyRevenueRow}>
              <span>{month}</span>
              <span className={styles.amount}>AED {amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Upcoming Payments Table (shadcn/ui style) */}
    <div style={{ marginTop: '2.5rem' }}>
      <h2 className={styles.upcomingPaymentsTitle}>Upcoming Payments</h2>
      <div style={{
        overflowX: 'auto',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(16,30,54,0.04)',
      }}>
        <table className={styles.upcomingPaymentsTable} style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Amount</th>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Status</th>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Due Date</th>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Reference #</th>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Payment Method</th>
              <th className={styles.upcomingPaymentsHeader} style={{ textAlign: 'left', padding: '2rem', color: '#374151', borderBottom: '2px solid #e5e7eb' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {upcoming_payments && upcoming_payments.length > 0 ? (
              upcoming_payments.map((payment, idx) => (
                <tr key={idx} style={{ borderBottom: '2px solid #e5e7eb', transition: 'background 0.2s' }}>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>AED {payment.amount?.toLocaleString()}</td>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>
                    <span className={styles.upcomingPaymentsStatus} style={{
                      background: payment.status === 'pending' ? '#f59e4222' : '#22c55e22',
                      color: payment.status === 'pending' ? '#f59e42' : '#22c55e',
                      borderRadius: '0.375rem',
                      padding: '0.35em 1.25em',
                      letterSpacing: '0.03em',
                    }}>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                  </td>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>{payment.due_date ? new Date(payment.due_date).toLocaleDateString() : 'N/A'}</td>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>{payment.reference_number || 'N/A'}</td>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>{payment.payment_method?.replace('_', ' ') || 'N/A'}</td>
                  <td className={styles.upcomingPaymentsCell} style={{ padding: '2rem', verticalAlign: 'top' }}>
                    {payment.receipt_image ? (
                      <img src={payment.receipt_image} alt="Receipt" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                    ) : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.upcomingPaymentsCell} style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  No upcoming payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
   </>
  );
}

export default PaymentAnalyticsTabContent; 