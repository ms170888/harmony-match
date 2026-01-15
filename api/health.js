/**
 * Health Check API Endpoint
 * Returns status of the API
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'harmony-match',
    timestamp: new Date().toISOString()
  });
}
