// src/utils/validators.ts

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Steam ID validation regex
 * Matches Steam ID formats like:
 * - STEAM_0:0:12345678
 * - 76561197960265728 (SteamID64)
 */
const STEAM_ID_REGEX = /^(STEAM_[0-5]:[0-1]:[0-9]+|[0-9]{17})$/;

/**
 * Discord ID validation (just numbers, typically 17-19 digits)
 */
const DISCORD_ID_REGEX = /^[0-9]{17,19}$/;

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates a password
 * Rules:
 * - At least 8 characters
 * - Contains at least one letter and one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(password)) return false;
  
  // Must contain at least one number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
};

/**
 * Validate Steam ID
 */
export const isValidSteamId = (id: string): boolean => {
  return STEAM_ID_REGEX.test(id);
};

/**
 * Validate Discord ID
 */
export const isValidDiscordId = (id: string): boolean => {
  return DISCORD_ID_REGEX.test(id);
};

/**
 * Validate player ID (Steam or Discord)
 */
export const isValidPlayerId = (id: string): boolean => {
  return isValidSteamId(id) || isValidDiscordId(id);
};

/**
 * Validate a ban form
 */
export const validateBanForm = (values: {
  playerId: string;
  playerName: string;
  reason: string;
  evidence?: string;
  expiresAt?: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!values.playerId) {
    errors.playerId = 'Player ID is required';
  } else if (!isValidPlayerId(values.playerId)) {
    errors.playerId = 'Invalid player ID format (Steam ID or Discord ID)';
  }
  
  if (!values.playerName) {
    errors.playerName = 'Player name is required';
  } else if (values.playerName.length < 2) {
    errors.playerName = 'Player name must be at least 2 characters';
  }
  
  if (!values.reason) {
    errors.reason = 'Ban reason is required';
  } else if (values.reason.length < 5) {
    errors.reason = 'Ban reason must be at least 5 characters';
  }
  
  return errors;
};

/**
 * Validate login form
 */
export const validateLoginForm = (values: {
  email: string;
  password: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Validate registration form
 */
export const validateRegistrationForm = (values: {
  email: string;
  password: string;
  displayName: string;
}) => {
  const errors: Record<string, string> = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters and contain at least one letter and one number';
  }
  
  if (!values.displayName) {
    errors.displayName = 'Display name is required';
  } else if (values.displayName.length < 3) {
    errors.displayName = 'Display name must be at least 3 characters';
  }
  
  return errors;
};