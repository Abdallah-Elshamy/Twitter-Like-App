import os
import validators
from flask import Flask, request, abort, jsonify
from flask_cors import CORS
from better_profanity import profanity
from nudenet import NudeClassifier
import base64
import requests
import urllib.request
import time
import random
import string


def is_SFW_image(image_path):
    result = classifier.classify(image_path)
    if (result[image_path]["unsafe"] > 0.8):
        return False
    return True

def is_SFW_video(video_path):
    result = classifier.classify_video(video_path)
    count = len(result['preds'])
    score = 0
    for item in result['preds'].items():
        score+= item[1]['unsafe']  
    if (score/count) > 0.8:
        return False    
    return True

def create_random_string():
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(10))

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
            'Access-Control-Allow-Methods', 'GET, POST')
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
            elif(profanity.contains_profanity(text)):
                return jsonify({
                    'success': True,
                    'SFW': False,
                    'message': 'This Tweet contains inappropriate word(s) and is marked as not safe for work!'
                })
            elif error == 0:
                for url in media_urls:
                    response = urllib.request.urlopen(url)
                    extension = response.headers['Content-Type'].split("/")[1]
                    media_name = str(time.time()) + create_random_string() + "." + extension
                    media_path = f"media_files/{media_name}"
                    urllib.request.urlretrieve(url, media_path)
                    type_ = extension.lower()
                    if(type_ == "jpg" or type_ == "png" or type_ == "gif" or type_ == "webp" or type_ == "tiff"
                        or type_ == "psd" or type_ == "raw" or type_ == "bmp" or type_ == "heif" or type_ == "indd"
                        or type_ == "jpeg"):
                        is_SFW = is_SFW_image(media_path)
                        os.remove(media_path)
                        if(is_SFW):
                            continue
                        else:
                            return jsonify({
                                'success': True,
                                'SFW': False,
                                'message': 'Media contains an unsafe for work image!'
                            })
                    if(type_ == "mp4" or type_ == "mov" or type_ == "wmv" or type_ == "flv" or type_ == "avi"
                        or type_ == "avchd" or type_ == "Webm" or type_ == "web" or type_ == "mkv"):
                        is_SFW = is_SFW_video(media_path)
                        os.remove(media_path)
                        if(is_SFW):
                            continue
                        else:
                            return jsonify({
                                'success': True,
                                'SFW': False,
                                'message': 'Media contains an unsafe for work video!'
                            })
                return jsonify({
                    'success': True,
                    'SFW': True,
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
    classifier = NudeClassifier()
    app.run(host='0.0.0.0', port=8080, debug=True)