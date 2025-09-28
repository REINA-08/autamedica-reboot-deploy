import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { ResendProvider } from '../resend.provider';
import type { SendEmailOptions, EmailAttachment } from '../email.service';

// Mock fetch
const mockFetch = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('ResendProvider', () => {
  let provider: ResendProvider;
  const apiKey = 're_test-api-key';

  beforeEach(() => {
    provider = new ResendProvider({ apiKey });
    mockFetch.mockClear();
  });

  describe('configuration validation', () => {
    it('should validate config with valid API key', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [] }), { status: 200 })
      );

      const isValid = await provider.validateConfig();
      expect(isValid).toBe(true);
    });

    it('should handle API key validation errors', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response('Unauthorized', { status: 401 })
      );

      const isValid = await provider.validateConfig();
      expect(isValid).toBe(false);
    });

    it('should handle network errors during validation', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const isValid = await provider.validateConfig();
      expect(isValid).toBe(false);
    });
  });

  describe('email sending', () => {
    it('should send basic email successfully', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>',
        tags: ['appointment', 'confirmation']
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'email-123' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      await provider.send(emailOptions);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AutaMedica <noreply@autamedica.com>',
            to: ['John Doe <patient@example.com>'],
            subject: 'Test Email',
            html: '<p>Test content</p>',
            tags: ['appointment', 'confirmation']
          })
        })
      );
    });

    it('should send email with attachments', async () => {
      const attachment: EmailAttachment = {
        filename: 'appointment.ics',
        content: 'QkVHSU46VkNBTEVOREFS',
        contentType: 'text/calendar',
        encoding: 'base64'
      };

      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Appointment Confirmation',
        html: '<p>Your appointment is confirmed</p>',
        attachments: [attachment]
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'email-123' }), { status: 200 })
      );

      await provider.send(emailOptions);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          body: JSON.stringify({
            from: 'AutaMedica <noreply@autamedica.com>',
            to: ['John Doe <patient@example.com>'],
            subject: 'Appointment Confirmation',
            html: '<p>Your appointment is confirmed</p>',
            attachments: [{
              filename: 'appointment.ics',
              content: 'QkVHSU46VkNBTEVOREFS',
              content_type: 'text/calendar'
            }]
          })
        })
      );
    });

    it('should send email with custom headers', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>',
        headers: {
          'X-Appointment-ID': 'apt-123',
          'X-Priority': 'high'
        }
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'email-123' }), { status: 200 })
      );

      await provider.send(emailOptions);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          body: JSON.stringify({
            from: 'AutaMedica <noreply@autamedica.com>',
            to: ['John Doe <patient@example.com>'],
            subject: 'Test Email',
            html: '<p>Test content</p>',
            headers: {
              'X-Appointment-ID': 'apt-123',
              'X-Priority': 'high'
            }
          })
        })
      );
    });

    it('should handle email address without name', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'email-123' }), { status: 200 })
      );

      await provider.send(emailOptions);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          body: JSON.stringify({
            from: 'AutaMedica <noreply@autamedica.com>',
            to: ['patient@example.com'],
            subject: 'Test Email',
            html: '<p>Test content</p>'
          })
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle HTTP error responses', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'invalid@example.com', name: 'Invalid User' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({
          message: 'Invalid email address',
          error: 'validation_error'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      await expect(provider.send(emailOptions)).rejects.toThrow(
        'Resend API error: Invalid email address'
      );
    });

    it('should handle network errors', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(provider.send(emailOptions)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle timeout errors', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 15000))
      );

      await expect(provider.send(emailOptions)).rejects.toThrow();
    });

    it('should handle rate limiting (429)', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({
          message: 'Rate limit exceeded',
          error: 'rate_limit'
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        })
      );

      await expect(provider.send(emailOptions)).rejects.toThrow(
        'Resend API error: Rate limit exceeded'
      );
    });

    it('should handle 5xx server errors', async () => {
      const emailOptions: SendEmailOptions = {
        from: 'noreply@autamedica.com',
        to: { email: 'patient@example.com', name: 'John Doe' },
        subject: 'Test Email',
        html: '<p>Test content</p>'
      };

      mockFetch.mockResolvedValueOnce(
        new Response('Internal Server Error', { status: 500 })
      );

      await expect(provider.send(emailOptions)).rejects.toThrow(
        'Resend API error: Internal Server Error'
      );
    });
  });

  describe('address normalization', () => {
    it('should normalize recipient with name correctly', () => {
      const recipient = { email: 'test@example.com', name: 'Test User' };
      expect((provider as any).normalizeAddress(recipient)).toBe('"Test User" <test@example.com>');
    });

    it('should normalize recipient without name correctly', () => {
      const recipient = { email: 'test@example.com' };
      expect((provider as any).normalizeAddress(recipient)).toBe('test@example.com');
    });

    it('should handle string addresses', () => {
      const address = 'test@example.com';
      expect((provider as any).normalizeAddress(address)).toBe('test@example.com');
    });

    it('should normalize attachment correctly', () => {
      const attachment: EmailAttachment = {
        filename: 'test.ics',
        content: 'QkVHSU46VkNBTEVOREFS',
        contentType: 'text/calendar; charset=utf-8',
        encoding: 'base64'
      };

      const normalized = (provider as any).normalizeAttachments([attachment]);

      expect(normalized).toEqual([{
        filename: 'test.ics',
        content: 'QkVHSU46VkNBTEVOREFS',
        content_type: 'text/calendar; charset=utf-8'
      }]);
    });
  });
});