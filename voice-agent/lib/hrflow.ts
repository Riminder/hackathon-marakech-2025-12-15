export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_BASE_URL || 'https://api.hrflow.ai/v1';
};

export const getApiKey = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_API_KEY || '';
};

export const getSourceKey = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_SOURCE_KEY || '';
};

export const getBoardKey = () => {
  return process.env.NEXT_PUBLIC_HRFLOW_BOARD_KEY || '';
};