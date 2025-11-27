/**
 * URL builder utility functions for CV Generator
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

/**
 * Builds a website URL
 * Requirement 6.1: Website URL construction
 */
export const buildWebsiteUrl = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const trimmedUrl = url.trim();
  return trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') 
    ? trimmedUrl 
    : `https://${trimmedUrl}`;
};

/**
 * Builds a LinkedIn profile URL
 * Requirement 6.2: LinkedIn URL construction
 */
export const buildLinkedInUrl = (username: string): string => {
  if (!username || username.trim() === '') return '';
  const trimmedUsername = username.trim().replace(/^\/+|\/+$/g, '');
  return `https://linkedin.com/in/${trimmedUsername}`;
};

/**
 * Builds a GitHub profile URL
 * Requirement 6.3: GitHub URL construction
 */
export const buildGitHubUrl = (username: string): string => {
  if (!username || username.trim() === '') return '';
  const trimmedUsername = username.trim().replace(/^\/+|\/+$/g, '');
  return `https://github.com/${trimmedUsername}`;
};

/**
 * Builds a Twitter profile URL
 * Requirement 6.4: Twitter URL construction
 */
export const buildTwitterUrl = (handle: string): string => {
  if (!handle || handle.trim() === '') return '';
  const trimmedHandle = handle.trim().replace(/^@+/, '');
  return `https://twitter.com/${trimmedHandle}`;
};

/**
 * Builds a mailto link
 * Requirement 6.5: Email link construction
 */
export const buildEmailUrl = (email: string): string => {
  if (!email || email.trim() === '') return '';
  return `mailto:${email.trim()}`;
};

/**
 * Builds a tel link
 * Requirement 6.6: Phone link construction
 */
export const buildPhoneUrl = (phone: string): string => {
  if (!phone || phone.trim() === '') return '';
  const cleanedPhone = phone.replace(/\s+/g, '');
  return `tel:${cleanedPhone}`;
};

/**
 * URL builder object for easy access
 */
export const urlBuilder = {
  website: buildWebsiteUrl,
  linkedin: buildLinkedInUrl,
  github: buildGitHubUrl,
  twitter: buildTwitterUrl,
  email: buildEmailUrl,
  phone: buildPhoneUrl,
};
