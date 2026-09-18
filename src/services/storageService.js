/**
 * Storage and Performance Analysis Engine
 * Handles persistent storage of real evaluation records returned by n8n,
 * aggregate statistical metrics, recurring weakness extraction, and AI improvement generation.
 */

const STORAGE_KEYS = {
  EVALUATIONS: 'ai_eval_evaluations_v2',
  SETTINGS: 'ai_eval_settings_v2'
};

// Default settings adhering strictly to environment variables
function getDefaultSettings() {
  return {
    n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://finalyearproject.app.n8n.cloud/webhook/ai-agent-evaluate',
    defaultAgentVersion: import.meta.env.VITE_DEFAULT_AGENT_ID || 'agent-v1',
    passThreshold: 8.0,
    needsImprovementThreshold: 6.0,
    modelName: 'gemini-1.5-flash',
    evaluatorModelName: 'gemini-1.5-pro'
  };
}

// Helper to initialize local storage
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.EVALUATIONS)) {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(getDefaultSettings()));
  }
}

// Auto-run init on import in browser environment
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    initStorage();
  }
} catch (e) {
  console.warn('LocalStorage unavailable during initial load:', e);
}

export const StorageService = {
  /**
   * Get all real evaluations stored in the system
   */
  getEvaluations() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse evaluations from localStorage', e);
      return [];
    }
  },

  /**
   * Get evaluation by ID
   */
  getEvaluationById(id) {
    const evals = this.getEvaluations();
    return evals.find(e => e.id === id) || null;
  },

  /**
   * Save a real evaluation returned from n8n workflow
   */
  saveEvaluation(evaluation) {
    const evals = this.getEvaluations();
    const newEval = {
      id: evaluation.id || `eval-${Date.now()}`,
      conversation_id: evaluation.conversation_id || `conv-${Date.now()}`,
      agent_id: evaluation.agent_id || 'agent-v1',
      agent_version: evaluation.agent_version || (evaluation.agent_id === 'agent-v1' ? 'v1.0.0' : 'v2.0.0'),
      user_input: evaluation.user_input || '',
      ai_response: evaluation.ai_response || '',
      correctness_score: Number(evaluation.correctness_score ?? 0),
      relevance_score: Number(evaluation.relevance_score ?? 0),
      completeness_score: Number(evaluation.completeness_score ?? 0),
      clarity_score: Number(evaluation.clarity_score ?? 0),
      instruction_following_score: Number(evaluation.instruction_following_score ?? 0),
      overall_score: Number(evaluation.overall_score ?? 0),
      verdict: evaluation.verdict || 'FAIL',
      strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
      weaknesses: Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [],
      improvement_suggestions: Array.isArray(evaluation.improvement_suggestions) ? evaluation.improvement_suggestions : [],
      created_at: evaluation.created_at || new Date().toISOString()
    };

    evals.unshift(newEval);
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evals));
    } catch (e) {
      console.error('Failed to save evaluation to localStorage', e);
    }
    return newEval;
  },

  /**
   * Delete an evaluation by ID
   */
  deleteEvaluation(id) {
    const evals = this.getEvaluations().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evals));
    return evals;
  },

  /**
   * Clear all evaluation records
   */
  clearEvaluations() {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify([]));
    return [];
  },

  /**
   * Get Settings
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...getDefaultSettings(), ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
    return getDefaultSettings();
  },

  /**
   * Update Settings
   */
  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  /**
   * Compute comprehensive dashboard metrics from real evaluations
   */
  getMetrics() {
    const evals = this.getEvaluations();
    const total = evals.length;

    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        passRate: 0,
        failRate: 0,
        needsImprovementRate: 0,
        passCount: 0,
        failCount: 0,
        needsImprovementCount: 0,
        avgCorrectness: 0,
        avgRelevance: 0,
        avgCompleteness: 0,
        avgClarity: 0,
        avgInstructionFollowing: 0,
        criteriaScores: [
          { criterion: 'Correctness', score: 0, fullMark: 10 },
          { criterion: 'Relevance', score: 0, fullMark: 10 },
          { criterion: 'Completeness', score: 0, fullMark: 10 },
          { criterion: 'Clarity', score: 0, fullMark: 10 },
          { criterion: 'Instruction Following', score: 0, fullMark: 10 }
        ],
        trendData: [],
        distributionData: [
          { range: '0-5.9 (Fail)', count: 0 },
          { range: '6.0-7.9 (Needs Imp)', count: 0 },
          { range: '8.0-8.9 (Good)', count: 0 },
          { range: '9.0-10.0 (Excellent)', count: 0 }
        ],
        verdictData: [],
        topWeaknesses: []
      };
    }

    let sumOverall = 0;
    let sumCorrectness = 0;
    let sumRelevance = 0;
    let sumCompleteness = 0;
    let sumClarity = 0;
    let sumInstruction = 0;

    let passCount = 0;
    let failCount = 0;
    let needsImprovementCount = 0;

    const distribution = {
      '0-5.9 (Fail)': 0,
      '6.0-7.9 (Needs Imp)': 0,
      '8.0-8.9 (Good)': 0,
      '9.0-10.0 (Excellent)': 0
    };

    const weaknessMap = {};

    const chronologicalEvals = [...evals].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const trendData = chronologicalEvals.map((e, index) => {
      sumOverall += e.overall_score;
      sumCorrectness += e.correctness_score;
      sumRelevance += e.relevance_score;
      sumCompleteness += e.completeness_score;
      sumClarity += e.clarity_score;
      sumInstruction += e.instruction_following_score;

      if (e.verdict === 'PASS') passCount++;
      else if (e.verdict === 'NEEDS_IMPROVEMENT') needsImprovementCount++;
      else failCount++;

      if (e.overall_score < 6.0) distribution['0-5.9 (Fail)']++;
      else if (e.overall_score < 8.0) distribution['6.0-7.9 (Needs Imp)']++;
      else if (e.overall_score < 9.0) distribution['8.0-8.9 (Good)']++;
      else distribution['9.0-10.0 (Excellent)']++;

      if (Array.isArray(e.weaknesses)) {
        e.weaknesses.forEach(w => {
          if (w && w.trim()) {
            const clean = w.trim();
            weaknessMap[clean] = (weaknessMap[clean] || 0) + 1;
          }
        });
      }

      return {
        index: index + 1,
        date: new Date(e.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        time: new Date(e.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        overall: Number(e.overall_score.toFixed(1)),
        correctness: Number(e.correctness_score.toFixed(1)),
        relevance: Number(e.relevance_score.toFixed(1)),
        completeness: Number(e.completeness_score.toFixed(1)),
        clarity: Number(e.clarity_score.toFixed(1)),
        instruction: Number(e.instruction_following_score.toFixed(1)),
        agentVersion: e.agent_version || e.agent_id || 'v1.0.0'
      };
    });

    const avgOverall = (sumOverall / total).toFixed(1);
    const avgCorrectness = (sumCorrectness / total).toFixed(1);
    const avgRelevance = (sumRelevance / total).toFixed(1);
    const avgCompleteness = (sumCompleteness / total).toFixed(1);
    const avgClarity = (sumClarity / total).toFixed(1);
    const avgInstructionFollowing = (sumInstruction / total).toFixed(1);

    const passRate = ((passCount / total) * 100).toFixed(0);
    const failRate = ((failCount / total) * 100).toFixed(0);
    const needsImprovementRate = ((needsImprovementCount / total) * 100).toFixed(0);

    const criteriaScores = [
      { criterion: 'Correctness', score: Number(avgCorrectness), fullMark: 10 },
      { criterion: 'Relevance', score: Number(avgRelevance), fullMark: 10 },
      { criterion: 'Completeness', score: Number(avgCompleteness), fullMark: 10 },
      { criterion: 'Clarity', score: Number(avgClarity), fullMark: 10 },
      { criterion: 'Instruction Following', score: Number(avgInstructionFollowing), fullMark: 10 }
    ];

    const distributionData = Object.entries(distribution).map(([range, count]) => ({
      range,
      count
    }));

    const verdictData = [
      { name: 'PASS', value: passCount, color: '#10b981' },
      { name: 'NEEDS_IMPROVEMENT', value: needsImprovementCount, color: '#f59e0b' },
      { name: 'FAIL', value: failCount, color: '#f43f5e' }
    ].filter(item => item.value > 0);

    const topWeaknesses = Object.entries(weaknessMap)
      .map(([weakness, count]) => ({ weakness, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      total,
      avgScore: Number(avgOverall),
      passRate: Number(passRate),
      failRate: Number(failRate),
      needsImprovementRate: Number(needsImprovementRate),
      passCount,
      failCount,
      needsImprovementCount,
      avgCorrectness: Number(avgCorrectness),
      avgRelevance: Number(avgRelevance),
      avgCompleteness: Number(avgCompleteness),
      avgClarity: Number(avgClarity),
      avgInstructionFollowing: Number(avgInstructionFollowing),
      criteriaScores,
      trendData,
      distributionData,
      verdictData,
      topWeaknesses
    };
  },

  /**
   * Version Comparison Analysis (Agent V1 vs Agent V2)
   */
  getVersionComparison() {
    const evals = this.getEvaluations();
    
    const v1Evals = evals.filter(e => e.agent_id === 'agent-v1' || e.agent_version?.includes('v1'));
    const v2Evals = evals.filter(e => e.agent_id === 'agent-v2' || e.agent_version?.includes('v2'));

    const calcStats = (list, versionLabel) => {
      if (!list || list.length === 0) {
        return {
          version: versionLabel,
          count: 0,
          avgOverall: 0,
          passRate: 0,
          avgCorrectness: 0,
          avgRelevance: 0,
          avgCompleteness: 0,
          avgClarity: 0,
          avgInstruction: 0,
          bestScore: 0,
          worstScore: 0
        };
      }
      const count = list.length;
      const passCount = list.filter(e => e.verdict === 'PASS').length;
      const avgOverall = Number((list.reduce((acc, e) => acc + e.overall_score, 0) / count).toFixed(1));
      const avgCorrectness = Number((list.reduce((acc, e) => acc + e.correctness_score, 0) / count).toFixed(1));
      const avgRelevance = Number((list.reduce((acc, e) => acc + e.relevance_score, 0) / count).toFixed(1));
      const avgCompleteness = Number((list.reduce((acc, e) => acc + e.completeness_score, 0) / count).toFixed(1));
      const avgClarity = Number((list.reduce((acc, e) => acc + e.clarity_score, 0) / count).toFixed(1));
      const avgInstruction = Number((list.reduce((acc, e) => acc + e.instruction_following_score, 0) / count).toFixed(1));
      const scores = list.map(e => e.overall_score);
      const bestScore = Math.max(...scores);
      const worstScore = Math.min(...scores);

      return {
        version: versionLabel,
        count,
        avgOverall,
        passRate: Number(((passCount / count) * 100).toFixed(0)),
        avgCorrectness,
        avgRelevance,
        avgCompleteness,
        avgClarity,
        avgInstruction,
        bestScore,
        worstScore
      };
    };

    const v1Stats = calcStats(v1Evals, 'Agent V1 (Baseline)');
    const v2Stats = calcStats(v2Evals, 'Agent V2 (Prompt-Optimized)');

    const deltaOverall = Number((v2Stats.avgOverall - v1Stats.avgOverall).toFixed(1));
    const deltaPassRate = v2Stats.passRate - v1Stats.passRate;
    const deltaCompleteness = Number((v2Stats.avgCompleteness - v1Stats.avgCompleteness).toFixed(1));
    const deltaClarity = Number((v2Stats.avgClarity - v1Stats.avgClarity).toFixed(1));
    const deltaInstruction = Number((v2Stats.avgInstruction - v1Stats.avgInstruction).toFixed(1));

    const criteriaComparison = [
      { criterion: 'Correctness', v1: v1Stats.avgCorrectness, v2: v2Stats.avgCorrectness },
      { criterion: 'Relevance', v1: v1Stats.avgRelevance, v2: v2Stats.avgRelevance },
      { criterion: 'Completeness', v1: v1Stats.avgCompleteness, v2: v2Stats.avgCompleteness },
      { criterion: 'Clarity', v1: v1Stats.avgClarity, v2: v2Stats.avgClarity },
      { criterion: 'Instruction', v1: v1Stats.avgInstruction, v2: v2Stats.avgInstruction }
    ];

    return {
      v1Stats,
      v2Stats,
      deltaOverall,
      deltaPassRate,
      deltaCompleteness,
      deltaClarity,
      deltaInstruction,
      criteriaComparison
    };
  },

  /**
   * Continuous Improvement Engine Analysis
   * Identifies recurring patterns and generates actionable prompt engineering recommendations based on real evaluation logs.
   */
  getImprovementInsights() {
    const evals = this.getEvaluations();
    const metrics = this.getMetrics();

    const insights = [];

    // Check if relevance is frequently low
    if (metrics.avgRelevance < 7.0 && metrics.total > 0) {
      insights.push({
        id: 'imp-relevance',
        title: 'Recurring Weakness: Off-Topic / Irrelevant Response Generation',
        category: 'Relevance & Intent Alignment',
        severity: 'CRITICAL',
        status: 'PENDING_REVIEW',
        detectedProblem: `Relevance score is low (${metrics.avgRelevance}/10). The agent is answering unrelated topics instead of directly addressing user inquiries.`,
        recommendation: 'Strengthen Agent Prompt: "Before generating the response, explicitly identify and reflect the exact core technical topic requested by the user. Do not generate explanations for unrelated concepts."',
        potentialImpact: 'Major boost to Relevance (+3.0) and Overall Score (+1.5).',
        affectedCriteria: ['relevance', 'correctness'],
        targetAgent: 'agent-v1 → agent-v2'
      });
    }

    // Check if completeness is frequently low
    if (metrics.avgCompleteness < 7.5 && metrics.total > 0) {
      insights.push({
        id: 'imp-completeness',
        title: 'Recurring Weakness: Incomplete Technical Explanations',
        category: 'Completeness',
        severity: 'HIGH',
        status: 'PENDING_REVIEW',
        detectedProblem: `Completeness score is averaging ${metrics.avgCompleteness}/10. Technical responses often lack definitions, parameters, or edge cases.`,
        recommendation: 'Update Agent Prompt: "Whenever explaining engineering or CS concepts, include definition, key components, code/architectural example, and real-world trade-offs."',
        potentialImpact: '+1.5 to +2.0 Boost to Completeness score.',
        affectedCriteria: ['completeness'],
        targetAgent: 'agent-v1 → agent-v2'
      });
    }

    // Check if instruction following is low
    if (metrics.avgInstructionFollowing < 7.5 && metrics.total > 0) {
      insights.push({
        id: 'imp-instructions',
        title: 'Recurring Weakness: Missing Code Examples When Requested',
        category: 'Instruction Following',
        severity: 'HIGH',
        status: 'PENDING_REVIEW',
        detectedProblem: `Instruction Following score is averaging ${metrics.avgInstructionFollowing}/10. Agent fails to provide code snippets or diagrams when explicitly prompted.`,
        recommendation: 'Update Agent Prompt: "Strictly adhere to all constraints in the user prompt (e.g. always include runnable code snippets when code is requested)."',
        potentialImpact: '+1.8 Boost to Instruction Following score.',
        affectedCriteria: ['instruction_following'],
        targetAgent: 'agent-v1 → agent-v2'
      });
    }

    // Default foundational improvement recommendations
    if (insights.length === 0) {
      insights.push(
        {
          id: 'imp-01',
          title: 'Topic-Locked Guardrails & Technical Grounding',
          category: 'Relevance & Correctness',
          severity: 'HIGH',
          status: 'IMPLEMENTED_IN_V2',
          detectedProblem: 'Baseline models may exhibit topic drift when responding to short technical queries.',
          recommendation: 'Enforce explicit topic validation in the system instruction before answer generation.',
          potentialImpact: 'Guarantees 100% relevance and eliminates off-topic FAIL verdicts.',
          affectedCriteria: ['relevance', 'correctness'],
          targetAgent: 'agent-v1 → agent-v2'
        },
        {
          id: 'imp-02',
          title: 'Code Example and Syntax Requirements',
          category: 'Completeness & Instruction Following',
          severity: 'MEDIUM',
          status: 'IMPLEMENTED_IN_V2',
          detectedProblem: 'Theoretical explanations without runnable code received lower completeness scores from the evaluator.',
          recommendation: 'System prompt instruction: "Whenever explaining a programming language or framework concept, always provide a concise, runnable, and syntactically valid code example with comments."',
          potentialImpact: '+1.5 Boost to Completeness and +1.2 Boost to Instruction Following.',
          affectedCriteria: ['completeness', 'instruction_following'],
          targetAgent: 'agent-v1 → agent-v2'
        },
        {
          id: 'imp-03',
          title: 'Structured Markdown Formatting & Comparison Tables',
          category: 'Clarity',
          severity: 'LOW',
          status: 'IMPLEMENTED_IN_V2',
          detectedProblem: 'Dense single-paragraph answers reduce reading comprehension on complex engineering questions.',
          recommendation: 'Enforce markdown headers (###), bold key terms, and bullet points for all comparisons and definitions.',
          potentialImpact: '+0.8 Boost to Clarity score across all response types.',
          affectedCriteria: ['clarity'],
          targetAgent: 'agent-v2'
        }
      );
    }

    return insights;
  }
};
