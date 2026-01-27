
class ApiResponse {
  static success(res, data, message = 'Succès', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Erreur', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Créé avec succès') {
    return this.success(res, data, message, 201);
  }

  static notFound(res, message = 'Ressource non trouvée') {
    return this.error(res, message, 404);
  }

  static unauthorized(res, message = 'Non autorisé') {
    return this.error(res, message, 401);
  }

  static badRequest(res, message = 'Requête invalide', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static paginated(res, data, page, limit, total) {
    return res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }
}

module.exports = ApiResponse;