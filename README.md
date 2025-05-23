# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Fetch Adopt

**Fetch Adopt** is a responsive React web application built for Fetch's frontend engineering take-home assignment. The app enables users to log in, browse adoptable shelter dogs, filter by breed, favorite dogs, and generate a match based on selected favorites. It fully meets the requirements outlined in the assignment brief and is designed with a focus on usability, responsiveness, and clean code architecture.

## Live Site

Deployed and publicly accessible at:  
[https://fetch-adopt.netlify.app](https://fetch-adopt.netlify.app)

## Repository

Source code is available at:  
[https://github.com/yeruvasruthi/yeruvasruthi.github.io](https://github.com/yeruvasruthi/yeruvasruthi.github.io)

## Features

- **Authentication**
  - Users log in with their name and email via the `/auth/login` endpoint
  - Authenticated session maintained via `HttpOnly` cookie
- **Search Functionality**
  - Browse available shelter dogs
  - Filter by breed
  - Paginate results (25 per page)
  - Sort by breed in ascending or descending order
- **Data Presentation**
  - All fields of the `Dog` object displayed: image, name, breed, age, zip code
- **Favorites and Match**
  - Favorite dogs directly from search results
  - Generate a match via the `/dogs/match` endpoint using selected favorites
- **Additional Enhancements**
  - Responsive design for desktop and mobile
  - Visual feedback on user interactions
  - Clean UI using Tailwind CSS
  - Smooth transitions with Framer Motion
  - Breed analytics integrated using Recharts
  - Toast notifications for actions like favoriting and match confirmation

## Technologies Used

- React (Vite)
- Tailwind CSS
- React Router
- Framer Motion
- Recharts
- Netlify (deployment)
- Fetch API (`credentials: 'include'` for authentication)

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yeruvasruthi/yeruvasruthi.github.io.git
   cd yeruvasruthi.github.io
