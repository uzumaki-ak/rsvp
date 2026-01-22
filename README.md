# RSVP 🎉 [Next.js 16.0.10 + Tailwind CSS 3.4.1 + Supabase 2.47.10]

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-000000?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.47.10-3ECF8E?style=flat&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat&logo=typescript)

---

## demo link: https://youtu.be/CQheZDy8PII
## 📖 Introduction

RSVP is a modern web application built with Next.js 16, Tailwind CSS 3, and Supabase, designed for managing event invitations, RSVPs, and administrative oversight. The platform enables event organizers to create events, share RSVP links, and monitor responses in real-time. It also supports user authentication for event admins, allowing secure access to RSVP data and event management features.

The codebase emphasizes a clean, component-driven architecture with server-side functions for data fetching and manipulation, leveraging Next.js' App Directory structure. The project incorporates Radix UI for accessible UI components, Lucide icons for visuals, and environment variables for configuration, ensuring a scalable and maintainable codebase.

---

## ✨ Features

- **Event Creation & Management:** Organizers can create new events with details like date, location, and description.
- **RSVP Form:** Dynamic RSVP form for guests to respond with options for attendance and accompanying guests.
- **Admin Dashboard:** Secure login for event admins to view RSVP responses, attendance counts, and manage events.
- **Authentication:** Sign in, sign up, password reset, and email confirmation flow integrated with Supabase Auth.
- **Real-time Data Fetching:** Server-side functions to retrieve RSVP data and event details from Supabase.
- **Shareable Event Links:** Generate and copy event URLs for easy sharing.
- **Theming Support:** Light and dark mode toggle using `next-themes`.
- **Responsive Design:** Mobile-friendly layout with Tailwind CSS.

---

## 🛠️ Tech Stack

| Library / Tool                     | Purpose                                              | Version        |
|-------------------------------------|------------------------------------------------------|----------------|
| **Next.js**                        | React framework, routing, server-side rendering    | 16.0.10        |
| **Tailwind CSS**                   | Utility-first CSS styling                          | 3.4.1          |
| **Supabase**                       | Backend-as-a-Service, auth & database             | 2.47.10        |
| **React**                          | UI component library                                | 19.2.3         |
| **Radix UI**                       | Accessible UI primitives                            | @radix-ui/react-label (2.1.1), radio group (1.2.2), toast (1.2.4), slot (1.1.1) |
| **Lucide React**                   | Icon components                                      | 0.469.0        |
| **date-fns**                       | Date manipulation                                    | 3.6.0          |
| **next-themes**                    | Theme toggling                                       | 0.4.6          |
| **Resend**                         | Email sending (e.g., confirmation, notifications) | 4.0.1          |
| **tailwind-merge**                 | Tailwind CSS class merging                            | 2.6.0          |
| **eslint + eslint-config-next**    | Linting & code quality                              | ESLint 9, 15.1.3 |
| **TypeScript**                     | Static typing for JavaScript                        | 5.0.0          |
| **PostCSS**                        | CSS processing                                       | 8.x            |

*(Note: Libraries like class-variance-authority and react-day-picker are also used for styling variants and date selection respectively.)*

---

## 🚀 Quick Start / Installation

Clone the repository:

```bash
git clone https://github.com/uzumaki-ak/rsvp.git
cd rsvp
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Configure environment variables by creating a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EMAIL_TO=<recipient-email>
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```
/app
  ├── (pages)               # Routing pages including login, signup, forgot password, RSVP, admin views
  ├── utils                 # Utility functions and client setup for Supabase
  ├── components            # Reusable UI components (buttons, forms, RSVP table, etc.)
  ├── actions               # Server actions for data fetching and mutations
  └── (pages)/admin         # Admin-specific pages for RSVP management
  └── (pages)/rsvp/[slug]  # Dynamic RSVP form per event

/public                        # Static assets like images, icons

/styles                        # Tailwind CSS configuration and global styles

/.env.local                   # Environment variables (API keys, URLs)

```

---

## 🔧 Configuration

### Environment Variables

| Variable                     | Description                                    | Example                                |
|------------------------------|------------------------------------------------|----------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`   | Your Supabase project URL                     | `https://xyzcompany.supabase.co`      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for Supabase               | `abcdefg1234567...`                   |
| `NEXT_PUBLIC_SITE_URL`       | Base URL of your deployment (used in email links) | `http://localhost:3000` or production URL |
| `EMAIL_TO`                   | Recipient email for notifications or RSVP summaries | `admin@yourdomain.com`               |

---

## 📄 API Reference

### Get Event by Slug

- **Endpoint:** `/api/events/[slug]` (server-side function)
- **Method:** GET
- **Description:** Fetch event details based on URL slug.
- **Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Event Title",
    "description": "Event description",
    "event_date": "2025-01-04",
    "event_location": "standard sweets, Palam, N.Delhi 110045",
    "slug": "event-slug",
    ...
  }
}
```

### Get RSVPs for Event

- **Endpoint:** `/api/events/[slug]/rsvps`
- **Method:** GET
- **Description:** Fetch RSVP responses associated with an event.
- **Response:** Array of RSVP objects with fields like name, email, attendance, accompany, created_at.

### Create Event

- **Endpoint:** `/api/events/create`
- **Method:** POST
- **Body:** Form data with event details.
- **Purpose:** Create new event entries in Supabase.

*(Note: Actual API routes may be implemented as Next.js API routes or server actions; refer to `/app/actions/createEvent.ts` and `/app/actions/getEvent.ts`.)*

---

## 📝 License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by modern event RSVP platforms.
- Utilizes Supabase for backend services.
- Built with Next.js 16 and Tailwind CSS for a sleek UI.
- Icons provided by Lucide React.

---

**This project is actively maintained and tailored for event organizers looking for a customizable RSVP solution. Contributions, issues, and discussions are welcome!**
