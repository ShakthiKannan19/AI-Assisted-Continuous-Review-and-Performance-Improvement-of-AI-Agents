import React from 'react';
import { getVerdictBadge } from '../utils/helpers';

export default function Badge({ verdict }) {
  const badge = getVerdictBadge(verdict);

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${badge.color}`}>
      {badge.label}
    </span>
  );
}
