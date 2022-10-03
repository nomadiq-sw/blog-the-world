import os
import logging
import jwt
from flask import g, request, abort


def decode_cookie():
    cookie = request.cookies.get("user")

    if not cookie:
        g.cookie = {}
        return

    try:
        g.cookie = jwt.decode(cookie, os.environ["JWT_SECRET_KEY"], algorithms=["HS256"])
    except jwt.InvalidTokenError as err:
        logging.warning(str(err))
        abort(401)
