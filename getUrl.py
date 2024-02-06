##This script is based on the python code published by Tim Schupp on https://blog.t1m.me/blog/solid-auth

import requests
import json
import hashlib
import urllib
from IPython.display import JSON
import base64
import os
import secrets
import jwt
import uuid
import time
from jwcrypto import jwk
from urllib.parse import urlparse, parse_qs

from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler

from io import BytesIO




def format_response(response):
    headers = dict(response.headers)
    body = response.json()
    #print("HEADERS:")
    #print(json.dumps(headers, indent=4))
    #print("BODY:")
    #print(json.dumps(body, indent=4))
    #print("COOKIES: ")
    #print(response.cookies)
    return headers, body

OICD_SERVER = "http://88.99.95.51:4000" # Some OpenId connect issuer
CLIENT_NAME = "ProjectXEmotibit"
CLIENT_URL = "http://localhost:9000/pages/connectSensor"

session = requests.Session()
def printURL():
    res = session.get(f"{OICD_SERVER}/.well-known/openid-configuration")

    headers, body = format_response(res)

    REGISTRATION_ENDPOINT = body['registration_endpoint']
    JWKS_URI = body['jwks_uri']
    TOKEN_ENDPOINT = body['token_endpoint']

    #print("REGISTRATION_ENDPOINT ",REGISTRATION_ENDPOINT)
    #print("JWKS_URI ",JWKS_URI)
    #print("TOKEN_ENDPOINT ",TOKEN_ENDPOINT)

    res = session.post(REGISTRATION_ENDPOINT, json={
      "client_name":CLIENT_NAME,
      "application_type":"web",
      "redirect_uris":[CLIENT_URL],
      "subject_type":"public",
      "token_endpoint_auth_method":"client_secret_basic",
      "id_token_signed_response_alg":"ES256",
      "grant_types":["authorization_code","refresh_token"]
    })

    headers, body = format_response(res)


    CLIENT_ID = body['client_id']
    CLIENT_SECRET = body['client_secret']
    REGISTRATION_URI = body['registration_client_uri']

    RANDOM_STATE = secrets.token_hex(8)
    CODE_VERIFIER = base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').replace('=', '')
    CODE_CHALLENGE = base64.urlsafe_b64encode(hashlib.sha256(CODE_VERIFIER.encode('utf-8')).digest()).decode('utf-8').replace('=', '')

    ##print('CLIENT_ID ', CLIENT_ID)
    ##print('CLIENT_SECRET', CLIENT_SECRET)
    ##print('REGISTRATION_URI', REGISTRATION_URI)
    ##print('CODE_CHALLENGE ', CODE_CHALLENGE)
    ##print('CODE_VERIFIER ', CODE_VERIFIER)
    ##print('RANDOM_STATE', RANDOM_STATE)

    LOGIN_URL = OICD_SERVER + "/.oidc/auth?" + urllib.parse.urlencode({
        'client_id': CLIENT_ID,
        'redirect_uri': CLIENT_URL,
        'response_type': 'code',
        'scope': 'openid offline_access webid',
        'state': RANDOM_STATE,
        'code_challenge': CODE_CHALLENGE,
        'code_challenge_method': 'S256',
        'prompt': 'consent',
        'response_mode': 'query'
    })

    #print(LOGIN_URL)
    ret = LOGIN_URL + "|" + CLIENT_ID + "|" + CODE_VERIFIER + "|" + TOKEN_ENDPOINT + "|" + CLIENT_SECRET
    return ret
  

class CORSRequestHandler(BaseHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        print("PATH" + self.path)
        query_components = parse_qs(urlparse(self.path).query)
        get = ""
        try:
            get = query_components["get"] 
        except:
            self.wfile.write(bytes("error", "utf-8"))
        if(get != ""):

            #self.wfile.write(b'Hello, world!')
            p = printURL()
            f = open("registerDevice", "w")
            #print(p)
            f.write(p)
            f.close()
            self.wfile.write(bytes(p.split("|")[0], "utf-8"))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.end_headers()
        response = BytesIO()
        response.write(b'This is POST request. ')
        response.write(b'Received: ')
        response.write(body)
        self.wfile.write(response.getvalue())


httpd = HTTPServer(('localhost', 8000), CORSRequestHandler)
httpd.serve_forever()
