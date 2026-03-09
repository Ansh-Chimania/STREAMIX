import React from 'react';

const Skeleton = ({ count = 6, type = 'card' }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div style={{ display: 'flex', gap: '12px', overflow: 'hidden', padding: '10px 4%' }}>
        {items.map(i => (
          <div key={i} style={{ minWidth: 180, flexShrink: 0 }}>
            <div className="card-skeleton" style={{ aspectRatio: '2/3', borderRadius: 8 }} />
            <div className="card-skeleton" style={{ height: 16, marginTop: 10, borderRadius: 4, width: '80%' }} />
            <div className="card-skeleton" style={{ height: 12, marginTop: 6, borderRadius: 4, width: '50%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div style={{ padding: '100px 4%' }}>
        <div className="card-skeleton" style={{ height: 400, borderRadius: 12, marginBottom: 24 }} />
        <div className="card-skeleton" style={{ height: 40, borderRadius: 8, width: '60%', marginBottom: 16 }} />
        <div className="card-skeleton" style={{ height: 20, borderRadius: 4, width: '40%', marginBottom: 12 }} />
        <div className="card-skeleton" style={{ height: 80, borderRadius: 8, marginBottom: 24 }} />
      </div>
    );
  }

  return null;
};

export default Skeleton;
