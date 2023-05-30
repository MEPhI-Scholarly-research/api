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



# !!! not checked with
#     assert(response.status_code == 200)
# because we can recreate database
def register(users):
  for user in users:
    response = requests.post('http://localhost:3000/api/v1/register', json=user)
    resData = response.json()
    print("\"register\":", resData, ",")



def create_quiz(user, quiz):
  response = requests.post('http://localhost:3000/api/v1/login', json=user)
  assert(response.status_code == 200)
  resData = response.json()
  print("\"login\":", resData, ",")
  accessToken = str(resData['access-token'])

  response = requests.post('http://localhost:3000/api/v1/quiz', json=quiz, headers={'Access-Token':accessToken})
  assert(response.status_code == 200)
  resData = response.json()
  print("\"quiz post\":", resData, ",")

  return resData['quiz']



def answer_process(user, quiz_uuid):
  response = requests.post('http://localhost:3000/api/v1/login', json=user)
  assert(response.status_code == 200)
  resData = response.json()
  print("\"login\":", resData, ",")
  accessToken = str(resData['access-token'])

  response = requests.get('http://localhost:3000/api/v1/quiz/start/'+quiz_uuid, headers={'Access-Token':accessToken})
  assert(response.status_code == 200)
  resData = response.json()
  print("\"quiz start\":", resData)
  sessionToken = str(resData['token'])
  
  sio.connect('http://localhost:3000')
  sio.emit('message', data='{"type":"connection", "token":"'+sessionToken+'"}')
  time.sleep(1)
  question = resData['quiz']['questions'][0]['uuid']
  option = resData['quiz']['questions'][0]['options'][0]['uuid']
  sio.emit('message', data='{"type":"answer", "question":"'+question+'", "answer":"'+option+'"}')
  option = resData['quiz']['questions'][0]['options'][2]['uuid']
  sio.emit('message', data='{"type":"answer", "question":"'+question+'", "answer":"'+option+'"}')
  question = resData['quiz']['questions'][1]['uuid']
  option = resData['quiz']['questions'][1]['options'][0]['uuid']
  sio.emit('message', data='{"type":"answer", "question":"'+question+'", "answer":"'+option+'"}')
  time.sleep(1)
  sio.emit('message', data='{"type":"finish", "token":"'+sessionToken+'"}')
  # sio.wait()

  sio.disconnect()



def end_to_end_test():
  users = [
    {'username':'username_0','displayname':'displayname_0','password':'password'},
    {'username':'username_1','displayname':'displayname_1','password':'password'},
    {'username':'username_2','displayname':'displayname_2','password':'password'}
  ]
  quiz = {'quiz':{'type':1,'title':'string','description':'string','time_limit':1000000,'questions':[{'type':1,'title':'question1','description':'string','serial':0,'options':[{'title':'answer11','serial':0,'is_correct':True},{'title':'answer12','serial':1,'is_correct':False},{'title':'answer13','serial':2,'is_correct':True}]},{'type':1,'title':'question2','description':'string','serial':0,'options':[{'title':'answer21','serial':0,'is_correct':False},{'title':'answer22','serial':1,'is_correct':True}]}]}}

  register(users)
  quiz_uuid = create_quiz(users[0], quiz)

  for user in users:
    answer_process(user, quiz_uuid)



end_to_end_test()