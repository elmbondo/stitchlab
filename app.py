import os
from flask import Flask, render_template, redirect, url_for
from flask_dance.contrib.google import make_google_blueprint, google
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY")

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

google_bp = make_google_blueprint(
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    redirect_to="dashboard",
    scope=["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
)
app.register_blueprint(google_bp, url_prefix="/auth")

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if not google.authorized:
        return redirect(url_for('index'))
    user_info = google.get("/oauth2/v2/userinfo")
    user = user_info.json()
    return render_template('upload.html',
        user_name=user['name'],
        user_initial=user['name'][0].upper()
    )

@app.route('/analyse', methods=['POST'])
def analyse():
    return {'stitch': 'Double Crochet'}

if __name__ == '__main__':
    app.run(debug=True)