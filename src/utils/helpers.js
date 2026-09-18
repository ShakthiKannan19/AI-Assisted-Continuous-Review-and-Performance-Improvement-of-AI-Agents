/**
 * Utility helper functions for AI Agent Continuous Review Platform
 */

/**
 * Format score to 1 decimal place or 'N/A'
 */
export function formatScore(score) {
  if (score === null || score === undefined || isNaN(score)) return 'N/A';
  return Number(score).toFixed(1);
}

/**
 * Get color classes for score value (0 to 10 scale) in clean light theme
 */
export function getScoreColor(score) {
  if (score >= 8.0) return 'text-emerald-600';
  if (score >= 6.0) return 'text-amber-600';
  return 'text-rose-600';
}

export function getScoreProgressBarColor(score) {
  if (score >= 8.0) return 'bg-emerald-500';
  if (score >= 6.0) return 'bg-amber-500';
  return 'bg-rose-500';
}

/**
 * Get verdict styling details for clean light theme
 */
export function getVerdictBadge(verdict) {
  switch (verdict) {
    case 'PASS':
      return {
        label: 'PASS',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800'
      };
    case 'NEEDS_IMPROVEMENT':
      return {
        label: 'NEEDS IMPROVEMENT',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800'
      };
    case 'FAIL':
      return {
        label: 'FAIL',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBg: 'bg-rose-100 text-rose-800'
      };
    default:
      return {
        label: verdict || 'UNKNOWN',
        color: 'text-gray-700 bg-gray-50 border-gray-200',
        badgeBg: 'bg-gray-100 text-gray-800'
      };
  }
}

/**
 * Convert technical error into simple, friendly user message.
 * Never exposes n8n, webhook, JSON, or internal stack trace details.
 */
export function getUserFriendlyError(error) {
  if (!error) {
    return 'Sorry, something went wrong. Please try again.';
  }

  const errStr = typeof error === 'string' ? error : (error.message || '');
  const lower = errStr.toLowerCase();

  if (lower.includes('timeout') || lower.includes('timed out') || error.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.';
  }

  if (lower.includes('evaluator') || lower.includes('review') || lower.includes('parse') || lower.includes('json')) {
    return "Sorry, we couldn't complete the response review. Please try again.";
  }

  if (
    lower.includes('network') || 
    lower.includes('failed to fetch') || 
    lower.includes('connection') || 
    lower.includes('unavailable') ||
    lower.includes('404') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('504')
  ) {
    return 'The service is temporarily unavailable. Please try again.';
  }

  return "Sorry, we couldn't generate a response right now. Please try again.";
}

/**
 * Format timestamp nicely
 */
export function formatDate(isoString) {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return isoString;
  }
}
