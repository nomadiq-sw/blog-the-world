import os
from flask import Flask
from flask_migrate import Migrate
from flask_mail import Mail
from .models import db, User
from .routes import api, guard, cors


def create_app(test_config=None):
	app = Flask(__name__, instance_relative_config=True)
	app.register_blueprint(api)

	app.config.from_mapping(
		DATABASE=os.path.join(app.instance_path, 'project.db'),
	)

	if test_config is None:
		app.config.from_pyfile('config.py', silent=True)
	else:
		app.config.from_pyfile(test_config)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	db.init_app(app)
	Migrate(app, db)

	guard.init_app(app, User)
	cors.init_app(app)

	Mail(app)

	return app
