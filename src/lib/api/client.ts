import { serializeDate, type ApiErrorBody } from '../../../../common';

export type ApiClientConfig = {
  baseUrl?: string;
  storageKey?: string;
};

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly url: string;

  constructor(message: string, status: number, body: unknown, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

function normalizeBaseUrl(baseUrl?: string) {
  const trimmed = baseUrl?.trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
}

function readStoredToken(storageKey: string) {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(storageKey);
}

function writeStoredToken(storageKey: string, token: string | null) {
  if (typeof window === 'undefined') return;

  if (token) {
    window.localStorage.setItem(storageKey, token);
  } else {
    window.localStorage.removeItem(storageKey);
  }
}

function buildUrl(baseUrl: string, path: string) {
  if (!baseUrl) return path;
  return `${baseUrl}${path}`;
}

async function readResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
}

export function createNimbusRequestClient(config: ApiClientConfig = {}) {
  const baseUrl = normalizeBaseUrl(config.baseUrl ?? import.meta.env.VITE_API_BASE_URL);
  const storageKey = config.storageKey ?? 'nimbus-api-token';

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);
    const token = options.auth === false ? null : readStoredToken(storageKey);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      headers.set('content-type', 'application/json');
      body = JSON.stringify(options.body);
    }

    const response = await fetch(buildUrl(baseUrl, path), {
      ...options,
      headers,
      body,
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      const errorMessage = typeof responseBody === 'string'
        ? responseBody
        : (responseBody as ApiErrorBody | null)?.error
        ?? (responseBody as ApiErrorBody | null)?.message
        ?? `Request failed with status ${response.status}`;

      throw new ApiError(errorMessage, response.status, responseBody, response.url);
    }

    return responseBody as T;
  }

  async function requestJson<T>(path: string, options: RequestOptions = {}) {
    return request<T>(path, options);
  }

  async function requestText(path: string, options: RequestOptions = {}) {
    const body = await request<unknown>(path, options);
    return typeof body === 'string' ? body : '';
  }

  return {
    baseUrl,
    getAuthToken() {
      return readStoredToken(storageKey);
    },
    setAuthToken(token: string | null) {
      writeStoredToken(storageKey, token);
    },
    clearAuthToken() {
      writeStoredToken(storageKey, null);
    },
    requestJson,
    requestText,
    serializeDate,
  };
}

export type NimbusRequestClient = ReturnType<typeof createNimbusRequestClient>;
