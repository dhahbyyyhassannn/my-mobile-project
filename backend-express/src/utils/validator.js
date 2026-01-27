class Validator {
  static isValidCode(code) {
    return code && typeof code === 'string' && code.trim().length > 0;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidBureau(bureau) {
    return bureau && bureau.code && bureau.designation;
  }

  static isValidImmobilisation(immo) {
    return immo && immo.code;
  }

  static sanitizeString(str) {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }

  static validatePagination(page, limit) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 50;
    
    return {
      page: Math.max(1, p),
      limit: Math.min(Math.max(1, l), 1000),
      offset: (Math.max(1, p) - 1) * Math.min(Math.max(1, l), 1000)
    };
  }
}

module.exports = Validator;