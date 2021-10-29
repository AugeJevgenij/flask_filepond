from flask import Flask, render_template, request
from flask.helpers import url_for
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.form import FlaskForm
from werkzeug.utils import redirect
from wtforms import TextField, SubmitField
from wtforms.validators import Optional, Required
import os
import json


app = Flask(__name__)

app.config["SECRET_KEY"] = "secret"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Sample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    image_paths = db.Column(db.String(300), nullable=False)

    def __repr__(self):
        return f"Sample('{self.name}', '{self.image_paths}')"


class SampleForm(FlaskForm):
    name = TextField("Name", validators=[Required()])
    image_paths = TextField(
        "Paths", validators=[Required()], default="default.png"
    )
    submit = SubmitField("Submit")


@app.route("/process", methods=["POST"])
def process():
    upload_dir = "static/images"
    file_names = []
    for key in request.files:
        file = request.files[key]
        picture_fn = file.filename
        file_names.append(picture_fn)
        picture_path = os.path.join(upload_dir, picture_fn)
        try:
            file.save(picture_path)
        except:
            print("save fail: " + picture_path)
    return json.dumps({"filename": [f for f in file_names]})


@app.route("/revert", methods=["DELETE"])
def revert():
    upload_dir = "static/images"
    print(request.data)
    parsed = json.loads(request.data)
    picture_fn = parsed["filename"][0]
    picture_path = os.path.join(upload_dir, picture_fn)
    try:
        os.remove(picture_path)
    except:
        print("delete fail: " + picture_path)

    return json.dumps({"filename": picture_fn})


@app.route("/new", methods=["POST", "GET"])
def new():
    form = SampleForm()
    if form.validate_on_submit():
        sample = Sample(name=form.name.data, image_paths=form.image_paths.data)
        db.session.add(sample)
        db.session.commit()
        return redirect(url_for("home"))
    return render_template("new_form.html", form=form)


@app.route("/sample/<int:id>")
def sample(id):
    sample = Sample.query.filter_by(id=id).first_or_404()
    img_paths = Convert(sample.image_paths)
    return render_template("sample.html", sample=sample, img_paths=img_paths)


@app.route("/", methods=["POST", "GET"])
def home():
    samples = Sample.query.all()

    return render_template("home.html", samples=samples)


def Convert(string):
    li = list(string.split(" "))
    return li


if __name__ == "__main__":
    app.run()
