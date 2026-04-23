Here's your single-file RBAC implementation. It runs cleanly as shown by the demo output above.

**What's inside:**

**3 core classes:**

- `Role` — holds a set of permissions and optional parent roles (inheritance chain)
- `User` — holds one or more roles plus optional direct (one-off) permissions
- `RBAC` — the engine; manages roles & users and exposes authorization APIs

**Key features:**

| Feature                 | Detail                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| **Role inheritance**    | `admin → moderator → editor → viewer` — permissions cascade down    |
| **Direct permissions**  | Grant a permission to a user outside any role (see Eve in the demo) |
| `authorize()`           | Throws an `AuthorizationError` (with `.statusCode = 403`) on denial |
| `check()`               | Returns `true/false`, never throws                                  |
| `canAll()` / `canAny()` | AND / OR checks across multiple permissions                         |
| `middleware()`          | Drop-in Express middleware — reads `req.user.id`, returns 401/403   |
| **Module export**       | `require("./rbac")` works cleanly in any Node.js project            |

**Express usage (snippet):**

```js
app.delete("/posts/:id", rbac.middleware("post:delete"), handler);
app.get("/admin", rbac.middleware("admin:panel"), handler);
```
