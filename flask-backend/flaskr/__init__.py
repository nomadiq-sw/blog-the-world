import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from .models import db
from .routes import api
from .auth import decode_cookie


def create_app(test_config=None):
	app = Flask(__name__, instance_relative_config=True)
	app.register_blueprint(api)
	app.before_request_funcs.setdefault(None, [decode_cookie])
	app.config.from_mapping(
		DATABASE=os.path.join(app.instance_path, 'project.db'),
	)

	if test_config is None:
		app.config.from_pyfile('config.py', silent=True)
	else:
		app.config.from_mapping(test_config)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	db.init_app(app)
	Migrate(app, db)

	return app
