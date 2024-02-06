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
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler





session = requests.Session()

CLIENT_NAME = "ProjectXEmotibit"
CLIENT_URL = "http://localhost:3000/connectSensor"
OICD_SERVER = "http://88.99.95.51:4000"
UPLOAD_PATH = "/test5/test2.txt"


# AUTH_CODE = "sys.argv[1]"
# state_value = "sys.argv[2]"
# CLIENT_ID = "sys.argv[3]"
# CODE_VERIFIER = "sys.argv[4]"
# TOKEN_ENDPOINT = ""
# CLIENT_SECRET = "sys.argv[6]"



def create_dpop_header(http_method, http_url, key):
  # build the clain about the current request
  dpop_claims = {
      "jti": str(uuid.uuid4()), # unique request id
      "htm": http_method, # request method
      "htu": http_url, # what url requested
      "iat": int(time.time()) # when ?
  }

  # get pub & priv keys
  private_key_pem = key.export_to_pem(private_key=True, password=None)
  public_jwk = key.export_public(as_dict=True)

  # create DPoP jwt token
  dpop_token = jwt.encode(
      dpop_claims,
      private_key_pem,
      algorithm='ES256',
      headers={
          'typ': 'dpop+jwt',
          'alg': 'ES256',
          'jwk': public_jwk
      }
  )
  return dpop_token


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
def printAuth(CLIENT_ID, CODE_VERIFIER, TOKEN_ENDPOINT, CLIENT_SECRET, AUTH_CODE, ):
# generate public & private keys
    key = jwk.JWK.generate(kty='EC', crv='P-256')

    dpop_token = create_dpop_header('POST', TOKEN_ENDPOINT, key)

    print('CLIENT_URL', CLIENT_URL)
    print('CLIENT_ID', CLIENT_ID)
    print('CODE_VERIFIER', CODE_VERIFIER)
    print('TOKEN_ENDPOINT', TOKEN_ENDPOINT)
    print('dpop_token', dpop_token)

    # prepare request body
    print(AUTH_CODE)
    token_data = {
        'grant_type': 'authorization_code',
        'code': AUTH_CODE,
        'redirect_uri': CLIENT_URL,
        'client_id': CLIENT_ID,
        'code_verifier': CODE_VERIFIER
    }

    res = session.post(
        TOKEN_ENDPOINT,
        data=token_data,
        auth=(CLIENT_ID, CLIENT_SECRET),
        headers={'DPoP': dpop_token}
    )

    headers, body = format_response(res)

    ACCESS_TOKEN = body['access_token']
    ID_TOKEN = body['id_token']
    REFRESH_TOKEN = body['refresh_token']

    print('ACCESS_TOKEN ', ACCESS_TOKEN)
    print('ID_TOKEN ', ID_TOKEN)
    print('REFRESH_TOKEN ', REFRESH_TOKEN)

    ##
    ##
    upload_url = f"{OICD_SERVER}{UPLOAD_PATH}"
    ##print('upload_url ', upload_url)
    ##
    dpop_header = create_dpop_header('PUT', upload_url, key)

    headers = {
        'Authorization': f'DPoP {ACCESS_TOKEN}',
        'Dpop': dpop_header,
        'Content-Type': 'text/plain'  # Adjust Content-Type to your file's MIME type
    }
    print(headers)
    ##response = session.put(upload_url, headers=headers, data="sdfdsfsdff")  # Use data instead of files
    return headers;


class CORSRequestHandler(BaseHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        #self.wfile.write(b'Hello, world!')
        f = open("registerDevice", "r")
        da = f.read().split("|")
        f.close()
        print(da)
        query_components = parse_qs(urlparse(self.path).query)
        AUTH_CODE = ""
        state_value = ""
        try:
            AUTH_CODE = query_components["code"] 
            state_value = query_components["state"] 
        except:
            print("error")
        # CLIENT_ID = da[1]
        # CODE_VERIFIER = da[2] 
        # TOKEN_ENDPOINT = da[3]
        # CLIENT_SECRET = da[4]
        
#        self.wfile.write(bytes("printAuth()", "utf-8"))
        #        CLIENT_ID = query_components["CLIENT_ID"] 
#        CODE_VERIFIER = query_components["CODE_VERIFIER"] 
#        TOKEN_ENDPOINT = query_components["TOKEN_ENDPOINT"] 
#        CLIENT_SECRET = query_components["CLIENT_SECRET"] 
        self.wfile.write(bytes(printAuth(da[1],da[2],da[3],da[4], AUTH_CODE, state_value), "utf-8"))

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


httpd = HTTPServer(('localhost', 9000), CORSRequestHandler)
httpd.serve_forever()
