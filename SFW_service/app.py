import os
import validators
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from profanity_check import predict


def create_app():
    # create and configure the app
    app = Flask(__name__)
    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, true')
        response.headers.add(
            'Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        return response

###############################################################################
# ROUTES#######################################################################
###############################################################################

    @app.route('/')
    def index():
        return jsonify({
            'success': True,
            'message': 'Service is up and running!'
            })

    @app.route('/safe-for-work', methods=['POST'])
    def is_SFW():
        error = 0
        try:
            body = request.get_json()
            text = body.get('text', '')
            media_urls = body.get('mediaURLs', [])
            for url in media_urls:
                valid = validators.url(url)
                if not valid:
                    error = 422
                    description = 'Invalid url was supplied!'
            if(text == '' and len(media_urls)==0):
                error = 422
                description = 'Please provide a text or mediaURLS in your tweet to be checked!'
            elif error == 0:
                return jsonify({
                    'success': True,
                    'text': text,
                    'mediaURL': media_urls,
                    })
        except:
            error = 500
            description = 'Something went wrong!'
        finally:
            if(error):
                abort(error, description=description)

###############################################################################
# ERRORS#######################################################################
###############################################################################

    @app.errorhandler(422)
    def unprocessable(error):
        return (jsonify({
            'success': False,
            'error': 422,
            'message': 'unprocessable',
            'description': error.description,
            }), 422)

    @app.errorhandler(400)
    def bad_request(error):
        return (jsonify({
            'success': False,
            'error': 400,
            'message': 'bad request',
            'description': error.description,
            }), 400)

    @app.errorhandler(405)
    def method_not_allowed(error):
        return (jsonify({
            'success': False,
            'error': 405,
            'message': 'method not allowed',
            }), 405)

    @app.errorhandler(500)
    def internal_server_error(error):
        return (jsonify({
            'success': False,
            'error': 500,
            'message': 'internal server error',
            }), 500)

    @app.errorhandler(404)
    def not_found(error):
        return (jsonify({
            'success': False,
            'error': 404,
            'message': 'resource not found',
            }), 404)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)