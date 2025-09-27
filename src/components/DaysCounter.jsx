import React from 'react';

function DaysCounter() {
  const today = new Date();
  const target2026 = new Date('2026-01-01T00:00:00+04:00');
  const daysLeft2026 = Math.ceil((target2026 - today) / (1000 * 60 * 60 * 24));

  return (
    <span style={{ fontWeight: 600, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span role="img" aria-label="calendar">📅</span>   2026: {daysLeft2026}
    </span>
  );
}

export default DaysCounter; 