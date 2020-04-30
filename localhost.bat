ECHO OFF
ECHO Starting server in current directory to port 8000
start chrome --new-tab "http://localhost:8000/"
py -m http.server
PAUSE