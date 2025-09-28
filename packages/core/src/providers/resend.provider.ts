/**
 * Provider de Resend para EmailService
 * Implementa la interfaz EmailProvider usando fetch HTTP
 */

import type {
  EmailProvider,
  SendEmailOptions,
  EmailProviderResponse,
  EmailAttachment,
  EmailAddress
} from '../services/email.service';

export interface ResendConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

interface ResendAttachment {
  filename: string;
  content: string;
  content_type: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: ResendAttachment[];
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
  reply_to?: string;
}

interface ResendResponse {
  id: string;
  from?: string;
  to?: string[];
  created_at?: string;
}

interface ResendError {
  name: string;
  message: string;
}

export class ResendProvider implements EmailProvider {
  private readonly config: Required<ResendConfig>;

  constructor(config: ResendConfig) {
    this.config = {
      baseUrl: 'https://api.resend.com',
      timeout: 30000,
      ...config
    };
  }

  async send(opts: SendEmailOptions): Promise<EmailProviderResponse> {
    try {
      const payload = this.buildPayload(opts);

      const response = await fetch(`${this.config.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AutaMedica/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText) as ResendError;
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no es JSON válido, usar el texto plano
          errorMessage = errorText || errorMessage;
        }

        throw new Error(`Resend API error: ${errorMessage}`);
      }

      const data = await response.json() as ResendResponse;

      return {
        messageId: data.id,
        status: 'sent'
      };

    } catch (error) {
      if (error instanceof Error) {
        // Error de red, timeout, etc.
        if (error.name === 'AbortError') {
          throw new Error('Email sending timeout');
        }
        throw error;
      }
      throw new Error('Unknown error sending email');
    }
  }

  async validateConfig(): Promise<boolean> {
    try {
      // Test con una llamada simple a la API
      const response = await fetch(`${this.config.baseUrl}/domains`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'AutaMedica/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });

      return response.status !== 401; // 401 = API key inválida
    } catch {
      return false;
    }
  }

  private buildPayload(opts: SendEmailOptions): ResendEmailPayload {
    const payload: ResendEmailPayload = {
      from: this.normalizeAddress(opts.from!),
      to: this.normalizeAddressList(opts.to),
      subject: opts.subject,
      html: opts.html
    };

    if (opts.cc) {
      payload.cc = this.normalizeAddressList(opts.cc);
    }

    if (opts.bcc) {
      payload.bcc = this.normalizeAddressList(opts.bcc);
    }

    if (opts.text) {
      payload.text = opts.text;
    }

    if (opts.replyTo) {
      payload.reply_to = this.normalizeAddress(opts.replyTo);
    }

    if (opts.attachments?.length) {
      payload.attachments = this.normalizeAttachments(opts.attachments);
    }

    if (opts.headers) {
      payload.headers = opts.headers;
    }

    if (opts.tags?.length) {
      payload.tags = opts.tags.map(tag => ({ name: tag, value: 'true' }));
    }

    return payload;
  }

  private normalizeAddress(address: EmailAddress): string {
    if (typeof address === 'string') {
      return address;
    }
    return address.name
      ? `"${address.name}" <${address.email}>`
      : address.email;
  }

  private normalizeAddressList(
    addresses: EmailAddress | EmailAddress[]
  ): string[] {
    const list = Array.isArray(addresses) ? addresses : [addresses];
    return list.map(addr => this.normalizeAddress(addr));
  }

  private normalizeAttachments(attachments: EmailAttachment[]): ResendAttachment[] {
    return attachments.map(att => ({
      filename: att.filename,
      content: typeof att.content === 'string'
        ? att.content
        : Buffer.from(att.content).toString('base64'),
      content_type: att.contentType || 'application/octet-stream'
    }));
  }
}

/**
 * Factory para crear provider de Resend desde variables de entorno
 */
export function createResendProvider(): ResendProvider {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }

  return new ResendProvider({
    apiKey,
    baseUrl: process.env.RESEND_BASE_URL,
    timeout: process.env.RESEND_TIMEOUT ? parseInt(process.env.RESEND_TIMEOUT) : undefined
  });
}