/**
 * ============================================================
 *  RBAC — Role-Based Access Control  (single-file, Node.js)
 * ============================================================
 */

"use strict";

class Role {
  constructor(name, permissions = [], parents = []) {
    this.name = name;
    this.permissions = new Set(permissions);
    this.parents = parents;
  }

  allPermissions() {
    const all = new Set(this.permissions);
    for (const parent of this.parents) {
      for (const p of parent.allPermissions()) all.add(p);
    }
    return all;
  }

  can(permission) {
    return this.allPermissions().has(permission);
  }
}

class User {
  constructor(id, name, roles = [], directPermissions = []) {
    this.id = id;
    this.name = name;
    this.roles = roles;
    this.directPermissions = new Set(directPermissions);
  }

  allPermissions() {
    const all = new Set(this.directPermissions);
    for (const role of this.roles) {
      for (const p of role.allPermissions()) all.add(p);
    }
    return all;
  }

  can(permission) {
    return this.allPermissions().has(permission);
  }
  canAll(...permissions) {
    return permissions.every((p) => this.can(p));
  }
  canAny(...permissions) {
    return permissions.some((p) => this.can(p));
  }
  roleNames() {
    return this.roles.map((r) => r.name);
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

class RBAC {
  constructor() {
    this._roles = new Map();
    this._users = new Map();
  }

  addRole(name, permissions = [], parentNames = []) {
    const parents = parentNames.map((n) => {
      const r = this._roles.get(n);
      if (!r) throw new Error(`Parent role "${n}" not found`);
      return r;
    });
    this._roles.set(name, new Role(name, permissions, parents));
    return this;
  }

  getRole(name) {
    return this._roles.get(name) ?? null;
  }

  addUser(id, name, roleNames = [], directPermissions = []) {
    const roles = roleNames.map((n) => {
      const r = this._roles.get(n);
      if (!r) throw new Error(`Role "${n}" not found`);
      return r;
    });
    this._users.set(id, new User(id, name, roles, directPermissions));
    return this;
  }

  getUser(id) {
    return this._users.get(id) ?? null;
  }

  authorize(userId, permission) {
    const user = this._mustGetUser(userId);
    if (!user.can(permission))
      throw new AuthorizationError(`User "${user.name}" lacks permission "${permission}"`);
    return true;
  }

  check(userId, permission) {
    try {
      return this.authorize(userId, permission);
    } catch {
      return false;
    }
  }

  middleware(...permissions) {
    return (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthenticated" });
      try {
        const user = this._mustGetUser(userId);
        const missing = permissions.filter((p) => !user.can(p));
        if (missing.length)
          return res.status(403).json({ error: `Forbidden — missing: ${missing.join(", ")}` });
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  _mustGetUser(id) {
    const u = this._users.get(id);
    if (!u) throw new Error(`User "${id}" not found`);
    return u;
  }
}

// ── Demo ──────────────────────────────────────────────────────

function demo() {
  const rbac = new RBAC();

  rbac
    .addRole("viewer", ["post:read"])
    .addRole("editor", ["post:create", "post:update"], ["viewer"])
    .addRole("moderator", ["post:delete", "user:read"], ["editor"])
    .addRole("admin", ["user:manage", "admin:panel"], ["moderator"]);

  rbac
    .addUser("u1", "Alice", ["viewer"])
    .addUser("u2", "Bob", ["editor"])
    .addUser("u3", "Carol", ["moderator"])
    .addUser("u4", "Dave", ["admin"])
    .addUser("u5", "Eve", ["viewer"], ["post:create"]);

  const CHECK = (userId, permission) => {
    const user = rbac.getUser(userId);
    const ok = rbac.check(userId, permission);
    console.log(
      `  ${ok ? "✅" : "❌"}  ${user.name.padEnd(6)} [${user.roleNames().join(",")}]  →  ${permission}`,
    );
  };

  console.log("\n═══════════════════════════════════════════");
  console.log("  RBAC Demo");
  console.log("═══════════════════════════════════════════\n");

  console.log("── post:read ─────────────────────────────");
  ["u1", "u2", "u3", "u4"].forEach((id) => CHECK(id, "post:read"));

  console.log("\n── post:create ───────────────────────────");
  ["u1", "u2", "u5"].forEach((id) => CHECK(id, "post:create"));

  console.log("\n── post:delete ───────────────────────────");
  ["u1", "u2", "u3", "u4"].forEach((id) => CHECK(id, "post:delete"));

  console.log("\n── admin:panel ───────────────────────────");
  ["u1", "u3", "u4"].forEach((id) => CHECK(id, "admin:panel"));

  console.log("\n── authorize() throws on denial ──────────");
  try {
    rbac.authorize("u1", "post:delete");
  } catch (err) {
    console.log(`  ⚠️  ${err.name}: ${err.message}`);
  }

  console.log("\n── canAll / canAny ───────────────────────");
  const carol = rbac.getUser("u3");
  console.log(
    `  Carol canAll(post:read, post:delete) → ${carol.canAll("post:read", "post:delete")}`,
  );
  console.log(
    `  Carol canAll(post:read, admin:panel) → ${carol.canAll("post:read", "admin:panel")}`,
  );
  console.log(
    `  Alice canAny(post:create, post:read) → ${rbac.getUser("u1").canAny("post:create", "post:read")}`,
  );

  console.log("\n── All permissions for Dave (admin) ──────");
  [...rbac.getUser("u4").allPermissions()].sort().forEach((p) => console.log(`  • ${p}`));

  console.log("\n═══════════════════════════════════════════\n");
}

demo();

module.exports = { RBAC, Role, User, AuthorizationError };
