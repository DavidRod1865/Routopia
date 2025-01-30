```markdown
# Routopia

A **route optimization** web application that lets users create, save, and visualize routes using the Google Maps API. Users can also generate a PDF version of each route, including a **screenshot of the map**, **number of stops**, **addresses**, and **step-by-step directions**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

---

## Features

1. **User Authentication**  
   - Secure login via [Auth0](https://auth0.com/) (or any other auth provider).
2. **Route Management**  
   - Create and save routes (and addresses) to a database (e.g., Supabase).  
   - Delete existing routes as needed.
3. **Optimized Directions**  
   - Uses the Google Maps Directions API with `optimizeWaypoints: true` for efficient ordering of stops.
4. **Dynamic Map**  
   - Displays the selected route on a responsive Google Map.
5. **PDF Generation**  
   - Captures the map + route details (addresses, directions) and exports them to a PDF.

---

## Tech Stack

- **React** + [Vite](https://vitejs.dev/) – Fast development server and build tooling.
- **Tailwind CSS** – Utility-first CSS framework.
- **Google Maps JavaScript API** – For maps, directions, and geocoding.
- **Auth0** – (Optional) For secure authentication.
- **Supabase** (or any other DB) – For storing user routes.
- **html2canvas** + **jspdf** – For capturing and generating PDF output.

---

## Setup & Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/your-username/routopia.git
   cd routopia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Environment Variables

Create a `.env` or `.env.local` file in the project root, specifying keys such as:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Scripts

- **Development**  
  ```bash
  npm run dev
  ```
  Launches the dev server at [http://localhost:5173](http://localhost:5173) by default.

- **Production Build**  
  ```bash
  npm run build
  ```
  Compiles and optimizes files into the `dist/` folder.

- **Preview**  
  ```bash
  npm run preview
  ```
  Serves the compiled production build locally for testing.

---

## Project Structure

A simplified example of how you might organize things:

```
src/
  ├─ features/
  │   ├─ auth/
  │   │   └─ ...
  │   ├─ routes/
  │   │   ├─ hooks/
  │   │   │   └─ useRouteManager.js
  │   │   ├─ RouteManager.jsx
  │   │   ├─ MapSection.jsx
  │   │   ├─ Sidebar.jsx
  │   │   ├─ RouteForm.jsx
  │   │   ├─ RouteList.jsx
  │   │   └─ ...
  ├─ components/
  │   ├─ Header.jsx
  │   └─ AuthButtons.jsx
  ├─ providers/
  │   └─ GoogleMapsProvider.jsx
  ├─ services/
  │   ├─ routeServices.js
  │   └─ ...
  ├─ App.jsx
  ├─ main.jsx
  ├─ index.css
  └─ ...
public/
  ├─ favicon.ico
  └─ ...
```

- **`features/routes`**: Components, hooks, and services related to route functionality.  
- **`components`**: Shared or global UI components (e.g., `Header`, `AuthButtons`).  
- **`providers`**: React Context or API providers (e.g., `GoogleMapsProvider`).  
- **`services`**: API calls or data-fetching logic (e.g., `fetchRoutes`, `saveRoute`).  

---

## Usage

1. **Start the Dev Server**  
   ```bash
   npm run dev
   ```
   Then open [http://localhost:5173](http://localhost:5173).

2. **Log In**  
   - Click **Login** (if Auth0 is configured) to authenticate.

3. **Add a Route**  
   - Use the **RouteForm** to enter a route name and addresses.  
   - Click **Save** to store it in the database.

4. **View a Route**  
   - Click **View** next to any route in **RouteList**.  
   - The map will display your route, and the details panel (e.g. `MapSection`) shows the addresses.

5. **Generate a PDF**  
   - Click **Generate PDF** to capture a **screenshot of the map** and **list of addresses** (plus **directions** if implemented).  
   - Save or share the PDF as needed.

6. **Delete a Route**  
   - Use the **Delete** button to remove any existing route.

---

## License

```text
MIT License

Copyright (c) 2023 ...

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[ License text continues... ]
```

---

**Enjoy using Routopia!** Feel free to submit issues or pull requests for new features and improvements.
```