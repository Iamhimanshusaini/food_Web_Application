# Foodly Super Admin folder

This folder splits the provided single-file dashboard into separate reusable components and pages.

## Folder structure

```text
superAdmin/
├── components/
│   ├── PageHeading.jsx
│   ├── RestaurantDetailsModal.jsx
│   ├── RestaurantTable.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   ├── SuperAdminHeader.jsx
│   ├── SuperAdminSidebar.jsx
│   └── Toast.jsx
├── context/
│   └── SuperAdminContext.jsx
├── data/
│   └── demoData.js
├── layout/
│   └── SuperAdminLayout.jsx
├── pages/
│   ├── Approvals.jsx
│   ├── Customers.jsx
│   ├── Orders.jsx
│   ├── Overview.jsx
│   ├── Restaurants.jsx
│   ├── Reviews.jsx
│   └── Settings.jsx
└── SuperAdminRoutes.jsx
```

## Install dependency

```bash
npm install lucide-react react-router-dom
```

Tailwind CSS must already be configured in your Vite project.

## Use it in App.jsx

Keep your existing `BrowserRouter` if your app already has one. Import `SuperAdminRoutes` and render it inside that router:

```jsx
import { BrowserRouter } from "react-router-dom";
import SuperAdminRoutes from "./superAdmin/SuperAdminRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <SuperAdminRoutes />
    </BrowserRouter>
  );
}
```

If your `App.jsx` already has other routes, do **not** replace the entire route tree. Instead, copy the nested `/super-admin` route group from `SuperAdminRoutes.jsx` into your existing `<Routes>` block, and remove the wildcard `*` route from this helper.

## Pages

- `/super-admin` — Overview
- `/super-admin/restaurants` — Restaurant directory
- `/super-admin/approvals` — Pending restaurant approvals
- `/super-admin/orders` — Orders
- `/super-admin/customers` — Customers
- `/super-admin/reviews` — Reviews
- `/super-admin/settings` — Settings

## Important notes

- The included restaurant, order, customer and review records are demo data copied/adapted from the supplied dashboard. They are not connected to MongoDB or your backend yet.
- Restaurant approve/reject state is shared between Overview, Restaurants and Approvals while the layout remains mounted, but it resets on a full page refresh.
- The sign-out button clears `superAdminToken` and redirects to `/login`. Change the key/path to match your actual Super Admin auth.
- The header/sidebar are shared through `SuperAdminLayout`; pages render in the `<Outlet />`.
