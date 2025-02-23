type CallbackTransformerResponse = {
  success: boolean;
  token: string | null;
  error?: {
    code: number;
    message: string;
  };
};

export function callbackTransformer(raw: any) {
  const response: CallbackTransformerResponse = {
    success: raw?.status === 'ok',
    token: raw?.token || null,
  };

  if (!response.success) {
    response.error = {
      code: raw?.error !== undefined ? raw.error : -1,
      message: raw?.message || 'Unknown error',
    };
  }

  return response;
}
