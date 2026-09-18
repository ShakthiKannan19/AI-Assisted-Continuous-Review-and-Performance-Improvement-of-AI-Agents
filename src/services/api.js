import axios from 'axios';
import { StorageService } from './storageService';

/**
 * API Service for interacting with n8n Webhook
 * Sends user prompt directly to n8n workflow and returns the real AI generated answer and AI evaluation.
 * NO silent mock/fallback evaluation data is used.
 */

export const ApiService = {
  /**
   * Send user message to n8n Webhook for Agent response generation and independent evaluation
   */
  async sendEvaluationRequest({ message, conversationId, agentId = 'agent-v1' }) {
    const settings = StorageService.getSettings();
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || settings?.n8nWebhookUrl;
    const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 45000;

    const payload = {
      message: message.trim(),
      conversationId: conversationId || `conv-${Date.now()}`,
      agentId: agentId || import.meta.env.VITE_DEFAULT_AGENT_ID || 'agent-v1'
    };

    console.log('Sending request to n8n:', webhookUrl);
    console.log('n8n request payload:', payload);

    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: timeout
      });

      console.log('n8n response:', response.data);

      const result = response.data;

      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response received from n8n: Expected JSON object.');
      }

      if (result.success === false && result.error) {
        throw new Error(`n8n workflow error: ${result.error}`);
      }

      const answer = result.answer || result.ai_response || '';
      const evaluation = result.evaluation;

      if (!answer && !evaluation) {
        throw new Error('n8n response is missing both "answer" and "evaluation" fields.');
      }

      if (!evaluation) {
        throw new Error('n8n response is missing the "evaluation" object.');
      }

      // Save the REAL evaluation returned by n8n to persistent storage
      const savedEval = StorageService.saveEvaluation({
        conversation_id: result.conversationId || payload.conversationId,
        agent_id: result.agentId || payload.agentId,
        agent_version: result.agentVersion || (payload.agentId === 'agent-v1' ? 'v1.0.0' : 'v2.0.0'),
        user_input: result.userInput || payload.message,
        ai_response: answer,
        correctness_score: Number(evaluation.correctness ?? 0),
        relevance_score: Number(evaluation.relevance ?? 0),
        completeness_score: Number(evaluation.completeness ?? 0),
        clarity_score: Number(evaluation.clarity ?? 0),
        instruction_following_score: Number(evaluation.instruction_following ?? 0),
        overall_score: Number(evaluation.overall_score ?? 0),
        verdict: evaluation.verdict || (Number(evaluation.overall_score || 0) >= 8.0 ? 'PASS' : Number(evaluation.overall_score || 0) >= 6.0 ? 'NEEDS_IMPROVEMENT' : 'FAIL'),
        strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
        weaknesses: Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : [],
        improvement_suggestions: Array.isArray(evaluation.improvement_suggestions) ? evaluation.improvement_suggestions : [],
        created_at: result.createdAt || new Date().toISOString()
      });

      return {
        success: true,
        source: 'n8n-live',
        conversationId: result.conversationId || payload.conversationId,
        answer: answer,
        evaluation: savedEval
      };
    } catch (error) {
      console.error('n8n request failed:', error);

      let errorMessage = '';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = `Request timed out after ${timeout / 1000}s. The n8n workflow or Gemini AI took too long to respond.`;
      } else if (error.response) {
        errorMessage = `n8n Webhook returned HTTP ${error.response.status}: ${
          typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data) || error.message
        }`;
      } else if (error.request) {
        errorMessage = 'Unable to connect to the n8n workflow. Please check whether the workflow is active/listening and CORS is allowed.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred while communicating with n8n.';
      }

      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Health check for n8n Webhook endpoint
   */
  async testConnection(customUrl) {
    const settings = StorageService.getSettings();
    const url = customUrl || import.meta.env.VITE_N8N_WEBHOOK_URL || settings?.n8nWebhookUrl;

    console.log('Testing connection to n8n webhook:', url);

    try {
      const response = await axios.post(url, {
        message: 'PING_TEST_CONNECTION',
        conversationId: 'ping-test',
        agentId: 'agent-v1'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log('Connection test response:', response.status, response.data);

      return {
        online: true,
        status: response.status,
        message: 'n8n Webhook is online and responsive!'
      };
    } catch (err) {
      console.error('Connection test failed:', err);
      let msg = '';
      if (err.response) {
        msg = `HTTP ${err.response.status}: Webhook responded with error`;
      } else if (err.code === 'ECONNABORTED') {
        msg = 'Connection timed out';
      } else {
        msg = 'Unable to reach webhook. Ensure n8n workflow is active or listening for test events.';
      }

      return {
        online: false,
        status: err.response ? err.response.status : 'ERR_NETWORK',
        message: msg
      };
    }
  }
};
