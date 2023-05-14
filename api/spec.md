### Quiz example with different question types

#### Quiz body

Quiz types:
- time_limited

```json
{
  "uuid":"uuid",
  "owner":"owner",
  "type":"time_limited",
  "title":"title",
  "description":"description",
  "questions": []
}
```

#### Question body

Question types:
- options
- custom

- options
```json
{
  "uuid":"uuid",
  "type":"options",
  "title":"title",
  "description":"description",
  "serial": 0,
  "options": [
    {
      "uuid":"uuid",
      "title":"title"
    }
  ]
},
```

- custom
```json
{
  "uuid":"uuid",
  "type":"custom",
  "title":"title",
  "description":"description",
}
```