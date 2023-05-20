import socketio
import requests
import time

sio = socketio.Client()

@sio.event
def connect():
  print('connection established')

@sio.on('message')
def my_message(data):
  print('message received with ', data)

@sio.event
def disconnect():
  print('disconnected from server')

def test_quiz():
  userBody = {'username':'username','password':'password'}
  quizBody = {'quiz':{'type':1,'title': 'string','description': 'string','time_limit': 1000000,'questions': [{'type': 1,'title': 'string','description': 'string','serial': 0,'options': [{'title': 'string','serial': 0},{'title': 'string','serial': 1}]}]}}

  # response = requests.post('http://localhost:3000/api/v1/register', json=userBody)
  # assert(response.status_code == 200)

  response = requests.patch('http://localhost:3000/api/v1/login', json=userBody)
  assert(response.status_code == 200)
  resData = response.json()
  accessToken = str(resData['token'])

  response = requests.post('http://localhost:3000/api/v1/quiz', json=quizBody, headers={'Access-Token':accessToken})
  assert(response.status_code == 200)
  resData = response.json()
  quizUuid = resData['quiz']

  response = requests.get('http://localhost:3000/api/v1/quiz/start/'+quizUuid, headers={'Access-Token':accessToken})
  assert(response.status_code == 200)
  resData = response.json()
  question = resData['quiz']['questions'][0]['uuid']
  option = resData['quiz']['questions'][0]['options'][0]['uuid']
  sessionToken = str(resData['token'])
  
  sio.connect('http://localhost:3000')
  sio.emit('message', data='{"type":"connection", "token":"'+sessionToken+'"}')
  time.sleep(1)
  sio.emit('message', data='{"type":"answer", "question":"'+question+'", "answer":"'+option+'"}')
  time.sleep(1)
  sio.emit('message', data='{"type":"finish", "token":"'+sessionToken+'"}')
  sio.wait()

test_quiz()