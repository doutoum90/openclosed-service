# reservation-service

This service fetchs information from reservation and timetables endpoints.

## Routes

### available

This route returns true if the given interval is available and false if not.

**URI** : /available

**Method** : GET

**Parameters**

| name       | type                            | required |
| ---------- | ------------------------------- | -------- |
| startDate  | date in format YYYY-MM-DD HH:mm | yes      |
| endDate    | date in format YYYY-MM-DD HH:mm | yes      |
| resourceId | int                             | yes      |

**Example**
GET http://ip:port/available?startDate=2020-12-17 08:00:00&endDate=2020-12-17 09:00:00&resourceId=1337

Response

```json
{
  "available": true
}
```
