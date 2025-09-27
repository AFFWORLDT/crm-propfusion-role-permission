import styles from "./PropertiesTabContent.module.css";

function PropertiesTabContent({ properties }) {
  return (
    <div className={styles.container}>
      {properties.map((item) => (
        <div className={styles.propertyCard} key={item.property.id}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>{item.property.title}</h2>
              <div className={styles.location}>{item.property.location || "Location not specified"}</div>
            </div>
            <div className={styles.typeTag}>
              {item.property.property_type || "Type not specified"}
            </div>
          </div>
          <div className={styles.meta}>
            <div>
              <div className={styles.label}>Building</div>
              <div>{item.property.building?.building_name || "Not specified"}</div>
            </div>
            <div>
              <div className={styles.label}>Unit Number</div>
              <div>{item.property.house_no || "Not specified"}</div>
            </div>
            <div>
              <div className={styles.label}>Property ID</div>
              <div>#{item.property.id}</div>
            </div>
            <div>
              <div className={styles.label}>Payments</div>
              <div>{item.payment_count}</div>
            </div>
          </div>
          <div className={styles.revenueRow}>
            <div>
              <div className={styles.label}>Revenue</div>
              <div className={styles.revenue}>AED {item.total_revenue.toLocaleString()}</div>
            </div>
            <div>
              <div className={styles.label}>Collected</div>
              <div className={styles.collected}>AED {item.total_collected.toLocaleString()}</div>
            </div>
            <div>
              <div className={styles.label}>Pending</div>
              <div className={styles.pending}>AED {item.total_pending.toLocaleString()}</div>
            </div>
          </div>
          {item.agreements.map((agreement) => (
            <div className={styles.agreementCard} key={agreement.id}>
              <div className={styles.agreementHeader}>
                <span>Agreement #{agreement.id}</span>
                <span className={styles.status + " " + styles[agreement.status.toLowerCase()]}>{agreement.status}</span>
              </div>
              <div className={styles.agreementDetails}>
                <div>
                  <span className={styles.label}>Tenant</span>
                  <span>{agreement.tenant?.name}</span>
                </div>
                <div>
                  <span className={styles.label}>Duration</span>
                  <span>
                    {agreement.start_date?.slice(0, 10) || "-"} - {agreement.end_date?.slice(0, 10) || "-"}
                  </span>
                </div>
                <div>
                  <span className={styles.label}>Rent Amount</span>
                  <span>AED {agreement.rent_amount}</span>
                </div>
                <div>
                  <span className={styles.label}>Security Deposit</span>
                  <span>AED {agreement.security_deposit}</span>
                </div>
              </div>
              <div className={styles.paymentsSection}>
                <div className={styles.label}>Recent Payments</div>
                {agreement.payments.length === 0 ? (
                  <div className={styles.noPayments}>No payments</div>
                ) : (
                  <table className={styles.paymentsTable}>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agreement.payments.map((payment, idx) => (
                        <tr key={idx}>
                          <td className={styles.paymentStatus + ' ' + styles[payment.status.toLowerCase()] + ' ' + styles.status}>{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</td>
                          <td className={styles.amount}>{'AED ' + payment.amount.toLocaleString()}</td>
                          <td className={styles.dueDate}>{payment.due_date?.slice(0, 10)}</td>
                          <td className={styles.paymentMethod}>{payment.payment_method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PropertiesTabContent;
