import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { EmailService } from '../email.service';
import type {
  EmailProvider,
  SendEmailOptions,
  EmailServiceConfig,
  EmailProviderResponse
} from '../email.service';

// Mock provider para tests
class MockEmailProvider implements EmailProvider {
  send: MockedFunction<EmailProvider['send']> = vi.fn();
  validateConfig: MockedFunction<NonNullable<EmailProvider['validateConfig']>> = vi.fn();
}

describe('EmailService', () => {
  let emailService: EmailService;
  let mockProvider: MockEmailProvider;
  let config: EmailServiceConfig;

  beforeEach(() => {
    mockProvider = new MockEmailProvider();
    config = {
      defaultFrom: 'noreply@autamedica.com',
      provider: mockProvider,
      enableLogging: false,
      retryAttempts: 3,
      retryDelayMs: 10
    };
    emailService = new EmailService(config);
    vi.clearAllMocks();
  });

  describe('email sending', () => {
    it('should send email successfully', async () => {
      const emailOptions: SendEmailOptions = {
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>',
        tags: ['test']
      };

      const mockResponse: EmailProviderResponse = {
        messageId: 'msg-123',
        status: 'sent'
      };

      mockProvider.send.mockResolvedValue(mockResponse);

      const result = await emailService.send(emailOptions);

      expect(result).toEqual(mockResponse);
      expect(mockProvider.send).toHaveBeenCalledWith({
        ...emailOptions,
        from: config.defaultFrom
      });
    });

    it('should use provided from address', async () => {
      const emailOptions: SendEmailOptions = {
        to: { email: 'patient@example.com', name: 'John Doe' },
        from: 'custom@autamedica.com',
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockProvider.send.mockResolvedValue({ status: 'sent' });

      await emailService.send(emailOptions);

      expect(mockProvider.send).toHaveBeenCalledWith({
        ...emailOptions,
        from: 'custom@autamedica.com'
      });
    });

    it('should handle provider errors', async () => {
      const emailOptions: SendEmailOptions = {
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockProvider.send.mockRejectedValue(new Error('Provider error'));

      await expect(emailService.send(emailOptions)).rejects.toThrow(
        'Failed to send email after 3 attempts: Provider error'
      );

      expect(mockProvider.send).toHaveBeenCalledTimes(3);
    });

    it('should retry on failure', async () => {
      const emailOptions: SendEmailOptions = {
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      const mockResponse: EmailProviderResponse = { status: 'sent' };

      mockProvider.send
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockRejectedValueOnce(new Error('Temporary error'))
        .mockResolvedValueOnce(mockResponse);

      const result = await emailService.send(emailOptions);

      expect(result).toEqual(mockResponse);
      expect(mockProvider.send).toHaveBeenCalledTimes(3);
    });
  });

  describe('batch sending', () => {
    it('should send multiple emails', async () => {
      const emails: SendEmailOptions[] = [
        {
          to: { email: 'patient1@example.com', name: 'John Doe' },
          subject: 'Test Email 1',
          html: '<p>Test content 1</p>'
        },
        {
          to: { email: 'patient2@example.com', name: 'Jane Doe' },
          subject: 'Test Email 2',
          html: '<p>Test content 2</p>'
        }
      ];

      mockProvider.send.mockResolvedValue({ status: 'sent' });

      const results = await emailService.sendBatch(emails);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('sent');
      expect(mockProvider.send).toHaveBeenCalledTimes(2);
    });

    it('should handle failures in batch', async () => {
      const emails: SendEmailOptions[] = [
        {
          to: { email: 'patient1@example.com', name: 'John Doe' },
          subject: 'Test Email 1',
          html: '<p>Test content 1</p>'
        },
        {
          to: { email: 'patient2@example.com', name: 'Jane Doe' },
          subject: 'Test Email 2',
          html: '<p>Test content 2</p>'
        }
      ];

      mockProvider.send
        .mockResolvedValueOnce({ status: 'sent' })
        .mockRejectedValueOnce(new Error('Network error'));

      const results = await emailService.sendBatch(emails);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('failed');
      expect(results[1].error).toContain('Network error');
    });
  });

  describe('configuration validation', () => {
    it('should validate provider config', async () => {
      mockProvider.validateConfig.mockResolvedValue(true);

      const isValid = await emailService.validateConfig();

      expect(isValid).toBe(true);
      expect(mockProvider.validateConfig).toHaveBeenCalled();
    });

    it('should return true when provider has no validation', async () => {
      const providerWithoutValidation: EmailProvider = {
        send: vi.fn().mockResolvedValue({ status: 'sent' })
      };

      const serviceWithoutValidation = new EmailService({
        ...config,
        provider: providerWithoutValidation
      });

      const isValid = await serviceWithoutValidation.validateConfig();

      expect(isValid).toBe(true);
    });
  });

  describe('logging', () => {
    it('should log when enabled', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const loggingService = new EmailService({
        ...config,
        enableLogging: true
      });

      const emailOptions: SendEmailOptions = {
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockProvider.send.mockResolvedValue({ status: 'sent' });

      await loggingService.send(emailOptions);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EmailService] Sending email:',
        expect.objectContaining({
          to: { email: 'patient@example.com', name: 'John Doe' },
          subject: 'Test Email',
          attachments: 0
        })
      );

      consoleSpy.mockRestore();
    });
  });
});