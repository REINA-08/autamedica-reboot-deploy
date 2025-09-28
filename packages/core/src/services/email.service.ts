/**
 * Servicio de Email agnóstico de proveedor
 * Soporta múltiples providers (Resend, SendGrid, AWS SES, etc.)
 */

import type { Appointment } from '@autamedica/types';

/** —— Tipos base —— */
export type EmailAddress = string | { name?: string; email: string };

export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array; // base64 o bytes
  contentType?: string;         // p.ej. "text/calendar" o "application/pdf"
  encoding?: 'base64' | 'utf8' | 'binary';
}

export interface SendEmailOptions {
  to: EmailAddress | EmailAddress[];
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  from?: EmailAddress; // usa defaultFrom si no llega
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  tags?: string[]; // Para analytics/tracking
  replyTo?: EmailAddress;
}

export interface EmailProviderResponse {
  messageId?: string;
  status?: 'sent' | 'queued' | 'failed';
  error?: string;
}

export interface EmailProvider {
  send(opts: SendEmailOptions): Promise<EmailProviderResponse>;
  validateConfig?(): Promise<boolean>;
}

/** —— Config —— */
export interface EmailServiceConfig {
  defaultFrom: EmailAddress;
  provider: EmailProvider;
  enableLogging?: boolean;
  retryAttempts?: number;
  retryDelayMs?: number;
}

/** —— Servicio —— */
export class EmailService {
  private readonly config: Required<EmailServiceConfig>;

  constructor(cfg: EmailServiceConfig) {
    this.config = {
      enableLogging: false,
      retryAttempts: 3,
      retryDelayMs: 1000,
      ...cfg,
    };
  }

  /**
   * Envía un email con reintentos automáticos
   */
  async send(options: SendEmailOptions): Promise<EmailProviderResponse> {
    const normalized: SendEmailOptions = {
      from: options.from ?? this.config.defaultFrom,
      ...options,
    };

    if (this.config.enableLogging) {
      console.log('[EmailService] Sending email:', {
        to: normalized.to,
        subject: normalized.subject,
        attachments: normalized.attachments?.length ?? 0,
      });
    }

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.config.provider.send(normalized);

        if (this.config.enableLogging) {
          console.log('[EmailService] Email sent successfully:', response);
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        if (this.config.enableLogging) {
          console.error(`[EmailService] Attempt ${attempt} failed:`, error);
        }

        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelayMs * attempt);
        }
      }
    }

    throw new Error(
      `Failed to send email after ${this.config.retryAttempts} attempts: ${lastError?.message}`
    );
  }

  /**
   * Valida la configuración del provider
   */
  async validateConfig(): Promise<boolean> {
    if (this.config.provider.validateConfig) {
      return this.config.provider.validateConfig();
    }
    return true;
  }

  /**
   * Envía múltiples emails en batch
   */
  async sendBatch(emails: SendEmailOptions[]): Promise<EmailProviderResponse[]> {
    const results: EmailProviderResponse[] = [];

    for (const email of emails) {
      try {
        const response = await this.send(email);
        results.push(response);
      } catch (error) {
        results.push({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Helper para delay en reintentos
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Normaliza direcciones de email
   */
  static normalizeAddress(address: EmailAddress): string {
    if (typeof address === 'string') {
      return address;
    }
    return address.name
      ? `"${address.name}" <${address.email}>`
      : address.email;
  }

  /**
   * Normaliza lista de direcciones
   */
  static normalizeAddressList(
    addresses?: EmailAddress | EmailAddress[]
  ): string[] | undefined {
    if (!addresses) return undefined;
    const list = Array.isArray(addresses) ? addresses : [addresses];
    return list.map(addr => EmailService.normalizeAddress(addr));
  }
}