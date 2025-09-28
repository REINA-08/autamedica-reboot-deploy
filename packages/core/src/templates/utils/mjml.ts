/**
 * Utilidad para compilar MJML a HTML
 * Funciona tanto en Node.js como en Edge Runtime
 */

let mjmlLib: any = null;

// Intentar cargar MJML solo si estamos en Node.js
try {
  // Solo disponible en Node/SSR; no en edge runtime
  mjmlLib = require('mjml');
} catch (error) {
  // MJML no disponible - probablemente estamos en Edge Runtime
  console.warn('[MJML] Library not available, using fallback rendering');
}

export interface MJMLOptions {
  validationLevel?: 'strict' | 'soft' | 'skip';
  fonts?: Record<string, string>;
  keepComments?: boolean;
  beautify?: boolean;
  minify?: boolean;
}

export interface MJMLResult {
  html: string;
  errors?: Array<{
    line: number;
    message: string;
    tagName: string;
  }>;
  warnings?: Array<{
    line: number;
    message: string;
    tagName: string;
  }>;
}

/**
 * Compila MJML a HTML con fallback para Edge Runtime
 */
export function renderMJML(
  mjmlSource: string,
  options: MJMLOptions = {}
): MJMLResult {
  if (!mjmlLib) {
    // Fallback para Edge Runtime - devolver el HTML tal como está
    // En producción, los templates deberían pre-compilarse
    console.warn('[MJML] Using fallback rendering - templates should be pre-compiled for production');
    return {
      html: convertMJMLToBasicHTML(mjmlSource)
    };
  }

  try {
    const result = mjmlLib(mjmlSource, {
      validationLevel: options.validationLevel || 'soft',
      fonts: options.fonts,
      keepComments: options.keepComments,
      beautify: options.beautify,
      minify: options.minify,
      ...options
    });

    if (result.errors?.length && options.validationLevel === 'strict') {
      throw new Error(`MJML compilation errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    if (result.errors?.length || result.warnings?.length) {
      console.warn('[MJML] Compilation issues:', {
        errors: result.errors,
        warnings: result.warnings
      });
    }

    return {
      html: result.html,
      errors: result.errors,
      warnings: result.warnings
    };
  } catch (error) {
    console.error('[MJML] Compilation failed:', error);
    throw new Error(`MJML compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fallback básico para convertir MJML a HTML simple
 * Usado cuando MJML no está disponible (Edge Runtime)
 */
function convertMJMLToBasicHTML(mjmlSource: string): string {
  // Conversión muy básica para casos de emergencia
  // En producción real, los templates deberían pre-compilarse
  return mjmlSource
    .replace(/<mj-body[^>]*>/g, '<body style="margin:0;padding:0;background-color:#f6f7fb;">')
    .replace(/<\/mj-body>/g, '</body>')
    .replace(/<mj-section[^>]*>/g, '<div style="max-width:600px;margin:0 auto;background:#ffffff;padding:24px;">')
    .replace(/<\/mj-section>/g, '</div>')
    .replace(/<mj-column[^>]*>/g, '<div>')
    .replace(/<\/mj-column>/g, '</div>')
    .replace(/<mj-text([^>]*)>/g, '<div style="font-family:Arial,sans-serif;line-height:1.6;$1">')
    .replace(/<\/mj-text>/g, '</div>')
    .replace(/<mj-button([^>]*)href="([^"]*)"([^>]*)>/g, '<a href="$2" style="display:inline-block;padding:12px 24px;background:#0ea5e9;color:white;text-decoration:none;border-radius:4px;$1$3">')
    .replace(/<\/mj-button>/g, '</a>')
    .replace(/<mj-divider[^>]*\/>/g, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">')
    .replace(/<mjml[^>]*>/g, '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>')
    .replace(/<\/mjml>/g, '</html>');
}

/**
 * Verifica si MJML está disponible
 */
export function isMJMLAvailable(): boolean {
  return mjmlLib !== null;
}

/**
 * Pre-compila templates MJML para producción
 * Útil para build scripts
 */
export function precompileTemplate(
  templateName: string,
  mjmlSource: string,
  options?: MJMLOptions
): string {
  const result = renderMJML(mjmlSource, options);

  if (result.errors?.length) {
    console.error(`[MJML] Errors in template ${templateName}:`, result.errors);
  }

  if (result.warnings?.length) {
    console.warn(`[MJML] Warnings in template ${templateName}:`, result.warnings);
  }

  return result.html;
}