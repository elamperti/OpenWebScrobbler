type CallbackTransformerResponse = {
  success: boolean;
  error?: {
    code: number;
    message: string;
  };
};

export function callbackTransformer(raw: any) {
  const response: CallbackTransformerResponse = {
    success: raw?.status === 'ok',
  };

  if (!response.success) {
    response.error = {
      code: raw?.error !== undefined ? raw.error : -1,
      message: raw?.message || 'Unknown error',
    };
  }

  return response;
}
