import flask
import os
import requests
from absl import app, flags
from werkzeug.utils import secure_filename

from solid_oidc_client import SolidOidcClient, SolidAuthSession, MemStore

from utils.writeUtils import create_folder

_PORT = flags.DEFINE_integer('port', 3333, 'HTTP port to listen on')
_ISSUER = flags.DEFINE_string('issuer', 'https://lab.wirtz.tech/',
                              'Issuer')

_OID_CALLBACK_PATH = "/oauth/callback"


def get_redirect_url():
    return f"http://localhost:{_PORT.value}{_OID_CALLBACK_PATH}"


def main(_):
    solid_oidc_client = SolidOidcClient(storage=MemStore())
    solid_oidc_client.register_client(str(_ISSUER.value), [get_redirect_url()])

    flask_app = flask.Flask(__name__)
    flask_app.secret_key = 'notreallyverysecret123'

    @flask_app.route('/')
    def index():
        tested_url = flask.request.args.get('resource', '')

        if 'auth' in flask.session:
            session = SolidAuthSession.deserialize(flask.session['auth'])
            headers = session.get_auth_headers(tested_url, 'GET')
            web_id = session.get_web_id()
        else:
            headers = {}
            web_id = None

        if tested_url:
            res = requests.get(url=tested_url, headers=headers)
            resource_content = res.text
        else:
            resource_content = None

        return flask.render_template('index.html', web_id=web_id, resource_content=resource_content, resource=tested_url)

    @flask_app.route('/create_folder', methods=['POST'])
    def create():
        pod_endpoint = flask.request.form.get('resource2', '')
        folder_path = flask.request.form.get('folderResource', '')

        if not pod_endpoint or not folder_path:
            return flask.Response("Invalid parameters", status=400)
        
        res = None
        if 'auth' in flask.session:
            session = SolidAuthSession.deserialize(flask.session['auth'])
            res = create_folder(pod_endpoint, folder_path, session)

        # Check if the folder creation was successful
        if res.status_code == 201:
            return flask.Response(f"Folder '{folder_path}' created successfully", status=200)
        else:
            return flask.Response(f"Failed to create folder. Status code: {res.status_code}", status=500)

    
    @flask_app.route('/upload', methods=['POST'])
    def upload():
        tested_url = flask.request.form.get('resource1', '')
        headers = {}
        web_id = None

        if 'auth' in flask.session:
            session = SolidAuthSession.deserialize(flask.session['auth'])
            headers = session.get_auth_headers(tested_url, 'POST')
            web_id = session.get_web_id()

        if 'file' not in flask.request.files:
            return flask.Response("No file part", status=400)

        file = flask.request.files['file']

        if file.filename == '':
            return flask.Response("No selected file", status=400)

        if file:
            # Process the file and send it
            file.seek(0)
            filename = secure_filename(file.filename)
            sendFile = {"file": (filename, file.stream, file.mimetype)}
            headers['Slug'] = filename
            res = requests.post(url=tested_url, files=sendFile, headers=headers)
            resource_content = res.text

            return flask.render_template('index.html', web_id=web_id, resource_content=resource_content, resource1=tested_url)


        return flask.Response("Invalid file", status=400)
        
    
    @flask_app.route('/login', methods=['POST'])
    def login():
        login_url = solid_oidc_client.create_login_uri('/', get_redirect_url())
        return flask.redirect(login_url)
    
    @flask_app.route('/logout', methods=['POST'])
    def logout():
        flask.session.clear()
        return flask.redirect('/')


    @flask_app.route(_OID_CALLBACK_PATH)
    def oauth_callback():
        code = flask.request.args['code']
        state = flask.request.args['state']

        session = solid_oidc_client.finish_login(
            code=code,
            state=state,
            callback_uri=get_redirect_url(),
        )

        flask.session['auth'] = session.serialize()

        redirect_url = solid_oidc_client.get_application_redirect_uri(state)
        return flask.redirect(redirect_url)

    flask_app.run(port=_PORT.value, debug=True)


if __name__ == '__main__':
    app.run(main)
