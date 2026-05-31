import logging
from flask import Blueprint, jsonify
from werkzeug.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError

errors_bp = Blueprint('errors', __name__)
logger = logging.getLogger('backend_app')


@errors_bp.app_errorhandler(HTTPException)
def handle_http_exception(e):
    """Catches classic Flask/Werkzeug errors (400, 401, 403, 404, 405)."""
    if e.code in [401, 403]:
        logger.warning(f"Auth Security Event: {e.description} | Code: {e.code}")
    else:
        logger.info(f"HTTP Exception: {e.name} | Description: {e.description}")

    return jsonify({
        "error": e.name,
        "message": e.description,
        "status": e.code
    }), e.code

@errors_bp.app_errorhandler(SQLAlchemyError)
def handle_database_error(e):
    """Catches all database failures (integrity constraints, conncection drops)."""
    logger.error("Database Transaction Failure!", exc_info=True)

    return jsonify({
       "error": "Database Error",
       "message": "A data persistence error occurred. Please try your request again.",
      "status": 500
    }), 500


@errors_bp.app_errorhandler(Exception)
def handle_unhandled_exception(e):
    """Catches unexpected 500 Interval Server Errors (Null pointers, type mismatches)."""
    logger.critical(f"Unhandled Server Error: {str(e)}", exc_info=True)

    return jsonify({
        "error": "Interval Server Error",
        "message": "An unexpected error occurred on the server.",
        "status": 500
    }), 500