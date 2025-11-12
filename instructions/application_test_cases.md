# Test Case Notes

## Authentication

- Login pages are accessible to guests.
- Login form display username and password fields.
- Authentication fails show error messages.
- Successful authentication redirects to dashboard.
- Authenticated users are redirected to the dashboard when trying to access login pages.
- Logout functionality works and redirects to login page.

---

## Dashboard

- Accessible only to authenticated users.
- If user is not authenticated, redirect to login.

---

## Settings > Role

### Visibility

- The menu is visible only to:
  - Super Admin

### Access

- `index` page accessible by:
  - Super Admin

- `create` page accessible by:
  - Super Admin

- `edit` page accessible by:
  - Super Admin

### Actions

- Store (create) role allowed for:
  - Super Admin

- Update role allowed for:
  - Super Admin

- Delete role allowed for:
  - Super Admin

---

## Settings > Permission

### Visibility

- The menu is visible only to:
  - Super Admin

### Access

- `index` page accessible by:
  - Super Admin

- `create` page accessible by:
  - Super Admin

- `edit` page accessible by:
  - Super Admin

### Actions

- Store (create) permission allowed for:
  - Super Admin
- Update permission allowed for:
  - Super Admin
- Delete permission allowed for:
  - Super Admin

---

## Settings > User

### Visibility

- The menu is visible only to:
  - Super Admin

### Access

- `index` page accessible by:
  - Super Admin

- `create` page accessible by:
  - Super Admin

- `edit` page accessible by:
  - Super Admin

### Actions

- Store (create) user allowed for:
  - Super Admin

- Update user allowed for:
  - Super Admin

- Delete user allowed for:
  - Super Admin
