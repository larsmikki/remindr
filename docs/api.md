# Remindy API

Base URL: `http://localhost:3080/api` (or your configured port)

All request bodies are JSON (`Content-Type: application/json`).
All error responses use `{ "error": "<message>" }`.

---

## Birthdays

### `GET /api/birthdays`
Returns all birthdays sorted by insertion order.

**Response 200**
```json
[
  {
    "id": "50463b47-...",
    "name": "Mom",
    "date": "1955-04-10",
    "icon": "❤️",
    "createdAt": 1775201311461,
    "groups": ["Family"]
  }
]
```

---

### `POST /api/birthdays`
Creates a new birthday.

**Request body**
```json
{
  "name": "Mom",
  "date": "1955-04-10",
  "icon": "❤️"
}
```

| Field  | Type   | Required | Notes |
|--------|--------|----------|-------|
| name   | string | Yes      | Non-empty |
| date   | string | Yes      | `YYYY-MM-DD` |
| icon   | string | No       | Emoji character |

**Response 201** — the created birthday object
**Response 400** — `{ "error": "name is required" }` or `{ "error": "date must be in YYYY-MM-DD format" }`

---

### `GET /api/birthdays/:id`
Returns a single birthday.

**Response 200** — the birthday object
**Response 404** — `{ "error": "Not found" }`

---

### `PUT /api/birthdays/:id`
Updates a birthday. Replaces all editable fields.

**Request body** — same shape as POST
**Response 200** — the updated birthday
**Response 400** — validation error
**Response 404** — `{ "error": "Not found" }`

---

### `DELETE /api/birthdays/:id`
Deletes a birthday and all its groups.

**Response 204** — no body
**Response 404** — `{ "error": "Not found" }`

---

## Groups

Groups are string labels stored directly on the Birthday object. There is no separate Group entity.

### `POST /api/birthdays/:id/groups`
Adds a group label to a birthday. Duplicate labels are silently ignored.

**Request body**
```json
{ "group": "Family" }
```

**Response 200** — `{ "success": true }`

---

### `PUT /api/birthdays/:id/groups`
Replaces all groups for a birthday.

**Request body**
```json
{ "groups": ["Family", "Friends"] }
```

**Response 200** — `{ "success": true }`

---

### `DELETE /api/birthdays/:id/groups/:groupId`
Removes a single group label.

**Response 204** — no body

---

### `GET /api/groups`
Returns an empty array. Groups live on birthdays — this endpoint exists for compatibility only.

**Response 200** — `[]`

---

## Health

### `GET /api/health`
Liveness check.

**Response 200** — `{ "status": "ok" }`

---

## Data model

```typescript
interface Birthday {
  id:        string    // UUID
  name:      string
  date:      string    // YYYY-MM-DD
  icon?:     string    // emoji character
  createdAt: number    // Unix ms
  groups:    string[]  // group label names
}
```
