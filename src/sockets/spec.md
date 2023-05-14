# Description of Socket Logic

### Quiz without strict time intervals
Quiz with time interval to complete the entire quiz / all questions.

#### Process desciption
1. Client send GET on quiz/start/{uuid} and server answers with:
    ```json
    {
      "quiz":{},
      "answers":[{}],
      "token":"jwt"
    }
    ```
    JWT payload (is important only for server):
    ```json
    { "uuid":"uuid" }
    ```
    Server creates record in <b>redis</b> with key "quiz_session_\<session-uuid\>":
    ```json
    {
      "quiz":"uuid",
      "start":"time",
      "end":"time",
      "answers": [
        {"question":"uuid", "answer":"uuid"}
      ]
    }
    ```
    and save this data in Web-Socket's environment in server's memory.
    Also server creates record with key "quiz_session_\<user-uuid\>_\<quiz_uuid\>". It will store session uuid. The server needs this so that it does not start a new session if the client reconnects.

    If quiz is already started server will get a uuid of session from <b>redis</b> and return all quiz params. With selected answers.

2. Client has jwt for this quiz session and can go to the Web-Socket now:
    - Client can send now messages:
      - Connection-Message. After this message the server understands who and where is trying to connect, and starts sending Time-Messages. In this moment server try to get data from <b>redis</b> and quiz with uuid from <b>redis</b> from <b>persistent data storage</b>. Message body:
      ```json
      {"type":"connection", "token":"jwt"}
      ```
      - Answer-Message. Server saves answer in memory and after this revrite record in <b>redis</b>. This message should be sent after each selected answer. Message body:
      ```json
      {"type":"answer", "question":"uuid", "answer":"uuid"}
      ```
      - Finish-Message. Server saves all in <b>persistent data storage</b> and remove data from <b>redis</b>.
      ```json
      {"type":"finish", "token":"jwt"}
      ```
    - Server's messages:
      - Time-Message. Send every second. Message body:
      ```json
      {"type":"time", "left":"start (from redis) + duration (from database) - now"}
      ```

    Some points:
    - If connection dropped unexpectedly, client can connect to the socket one more time and send Connection-Message. If all is ok, server will download data about this session from <b>redis</b> and start sending Time-Messages.

    - At the moment of accidentally closing the connection, the server must save the data to <b>persistent storage</b> so that the client cannot start the test again.

    - If time limit ends. Server must save all answered questions in <b>persistent data storage</b> and send Time-Message with left = 0 seconds until client closes the connection.

<!-- ### Quiz with strict time intervals
Quiz with time intervals for every question.

#### Process desciption
1. Client send GET on quiz/start/{uuid} and server answers with:
 ```json
  {
    "quiz":{},
    "token":"jwt"
  }
  ```
  JWT payload (is important only for server):
  ```json
  { "uuid":"uuid" }
  ```
  Server creates record in <b>redis</b> with key "quiz_session_\<session-uuid\>":
  ```json
  {
    "quiz":"uuid",
    "start":"time",
    "end":"time",
    "answers": [
      {"question":"uuid", "answer":"uuid"}
    ]
  }
  ```
  and save this data in Web-Socket's environment in server's memory. Server also saves in memory -->