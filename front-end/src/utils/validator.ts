/**
 * Validate a Steam ID format
 * @param steamId - The Steam ID to validate
 * @returns Boolean indicating if the Steam ID is valid
 */
export const isValidSteamId = (steamId: string): boolean => {
    if (!steamId) return false;
    
    // Standard Steam ID format (STEAM_X:Y:Z)
    const steamIdRegex = /^STEAM_[0-1]:[0-1]:\d+$/;
    
    // Steam ID3 format ([U:1:XXXXXX])
    const steamId3Regex = /^\[U:1:\d+\]$/;
    
    // Steam ID64 format (17-digit number starting with 7656)
    const steamId64Regex = /^7656\d{13}$/;
    
    return steamIdRegex.test(steamId) || 
           steamId3Regex.test(steamId) || 
           steamId64Regex.test(steamId);
  };
  
  /**
   * Validate a Discord ID format
   * @param discordId - The Discord ID to validate
   * @returns Boolean indicating if the Discord ID is valid
   */
  export const isValidDiscordId = (discordId: string): boolean => {
    if (!discordId) return false;
    
    // Discord IDs are numeric and typically 17-19 digits
    const discordIdRegex = /^\d{17,19}$/;
    
    return discordIdRegex.test(discordId);
  };
  
  /**
   * Validate an IP address format
   * @param ip - The IP address to validate
   * @returns Boolean indicating if the IP address is valid
   */
  export const isValidIpAddress = (ip: string): boolean => {
    if (!ip) return false;
    
    // IPv4 format
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    
    // IPv6 format (simplified validation)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (ipv4Regex.test(ip)) {
      // Check if each octet is between 0 and 255
      const octets = ip.split('.');
      return octets.every(octet => parseInt(octet, 10) <= 255);
    }
    
    return ipv6Regex.test(ip);
  };
  
  /**
   * Validate required fields in a form
   * @param data - Object containing form data
   * @param requiredFields - Array of required field names
   * @returns Object with 'isValid' boolean and 'errors' map of field-specific error messages
   */
  export const validateRequiredFields = (
    data: Record<string, any>,
    requiredFields: string[]
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      const value = data[field];
      if (value === undefined || value === null || value === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate ban form data
   * @param data - Ban form data object
   * @returns Object with 'isValid' boolean and 'errors' map
   */
  export const validateBanForm = (data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } => {
    const requiredFields = ['playerName', 'steamId', 'reason', 'evidence', 'durationType'];
    const { isValid, errors } = validateRequiredFields(data, requiredFields);
    
    // Check for specific field validations
    if (data.steamId && !isValidSteamId(data.steamId)) {
      errors.steamId = 'Invalid Steam ID format';
    }
    
    if (data.discordId && !isValidDiscordId(data.discordId)) {
      errors.discordId = 'Invalid Discord ID format';
    }
    
    if (data.ipAddress && !isValidIpAddress(data.ipAddress)) {
      errors.ipAddress = 'Invalid IP address format';
    }
    
    if (data.durationType === 'temporary' && (!data.durationDays || data.durationDays <= 0)) {
      errors.durationDays = 'Duration days must be a positive number for temporary bans';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate appeal form data
   * @param data - Appeal form data object
   * @returns Object with 'isValid' boolean and 'errors' map
   */
  export const validateAppealForm = (data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } => {
    const requiredFields = ['reason', 'evidence'];
    const { isValid, errors } = validateRequiredFields(data, requiredFields);
    
    if (data.reason && data.reason.length < 10) {
      errors.reason = 'Reason must be at least 10 characters long';
    }
    
    if (data.evidence && data.evidence.length < 10) {
      errors.evidence = 'Evidence must be at least 10 characters long';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };