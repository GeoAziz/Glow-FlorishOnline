# Glow & Flourish - Complete Documentation

Welcome to the complete documentation for the Glow & Flourish e-commerce application. This document is divided into three parts:

-   **Part 1: User Guide:** For customers using the storefront.
-   **Part 2: Admin & Moderator Guide:** For store managers and content moderators.
-   **Part 3: Developer & Deployment Guide:** For developers setting up the project.

---

## Part 1: User Guide

This guide explains how to use the customer-facing features of the Glow & Flourish store.

### Creating an Account & Logging In

To access features like the dashboard, wishlist, and checkout, you'll need an account.

1.  Click the user icon in the top-right corner of the header.
2.  Select "Login/Register" from the dropdown menu.
3.  On the authentication page, you can either sign up with your email and password or use the one-click Google sign-in option.

### Shopping for Products

-   **Browse:** Click "Shop" in the main navigation to see all products.
-   **Filter:** On the shop page, use the filters on the left to narrow down products by category or price range.
-   **Sort:** Use the dropdown menu on the right to sort products by price or newest arrivals.
-   **Search:** Use the search bar in the header to find products by name or description.

### Using the AI Skincare Advisor

Our AI-powered advisor helps you build a personalized skincare routine.

1.  Click **"AI Advisor"** in the main navigation.
2.  Answer the two questions about your skin type and your primary skin concerns.
3.  Click **"Generate My Routine"**.
4.  The AI will analyze your needs and recommend a complete morning and evening routine, featuring products from our store that are best suited for you, along with general tips.

### Managing Your Cart & Wishlist

-   **Add to Cart:** On a product card or product page, click the shopping cart icon to add an item to your cart.
-   **Add to Wishlist:** Click the heart icon on any product to save it to your wishlist for later. You must be logged in to use the wishlist.
-   **View Cart:** Click the shopping cart icon in the header at any time to view your cart, adjust quantities, or proceed to checkout.

### The Checkout Process

1.  From your cart, click "Proceed to Checkout".
2.  Fill in your shipping address information.
3.  Choose your payment method:
    -   **PayPal / Credit Card:** Securely pay using the PayPal gateway.
    -   **Pay on Delivery:** Place your order now and pay in cash upon delivery.
4.  After placing your order, you will be redirected to an order confirmation page.

### Your Personal Dashboard

Once logged in, you can access your dashboard by clicking the user icon and selecting "Dashboard". Here you can:

-   **View Order History:** Track the status of your current and past orders.
-   **View My Wishlist:** See all the items you've saved.
-   **Edit Profile:** Update your display name.

---

## Part 2: Admin & Moderator Guide

This guide is for the team managing the store.

### 2.1 Admin Guide

Admins have full control over the application's data.

#### Managing Products

-   Navigate to **Dashboard -> Manage Products**.
-   **Create a Product:** Click "Add Product". Fill in the details manually.
-   **Use the AI Generator:** On the "Add Product" or "Edit Product" page, first enter a **Product Name** and some descriptive **Keywords** (e.g., "hydrating, for sensitive skin, anti-aging"). Then click **"Generate Descriptions"**. The AI will automatically write the short and long descriptions for you.
-   **Edit/Delete:** Use the actions menu (three dots) on the right of any product in the list to edit or delete it.

#### Managing Users

-   Navigate to **Dashboard -> Manage Users**.
-   Here you can see a list of all registered users.
-   Use the actions menu to change a user's role to `Admin`, `Moderator`, or `User`. **Use caution when assigning the Admin role.**

#### Managing Orders

-   Navigate to **Dashboard -> Manage Orders**.
-   This page lists all customer orders.
-   Use the actions menu to update the status of an order (`pending`, `processing`, `shipped`, `delivered`, `cancelled`). The customer will see this status update in their order history.

#### Viewing Analytics

-   Navigate to **Dashboard -> Analytics**.
-   View key performance indicators and a chart of your store's monthly revenue.

#### Creating the First Admin User

To create the very first admin user, you must run a command from your local terminal after setting up the project (see Developer Guide below).

```bash
npx tsx scripts/create-admin.ts your-email@example.com your-password
```

### 2.2 Moderator Guide

Moderators are responsible for maintaining content quality.

#### Managing the Review Queue

-   Navigate to **Dashboard -> Review Queue**.
-   This page lists all user-submitted product reviews that are awaiting moderation.
-   For each review, you can read the content and see which product it's for.
-   Click **"Approve"** to make the review visible on the product page.
-   Click **"Reject"** to discard the review.

---

## Part 3: Developer & Deployment Guide

This guide is for developers who want to run the project locally or deploy it.

### Project Overview

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS with shadcn/ui components
-   **Database & Auth:** Firebase (Firestore, Firebase Authentication)
-   **AI:** Google's Genkit
-   **Deployment:** Vercel

### Local Development Setup

#### Prerequisites

-   Node.js (v18 or higher)
-   A Google Cloud / Firebase project
-   A Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

#### Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase Admin Credentials:**
    -   Go to your Firebase project settings -> Service Accounts.
    -   Click "Generate new private key".
    -   Save the downloaded JSON file in the root of your project directory and rename it to `service-account-key.json`. **This file is gitignored and should never be committed to your repository.**

4.  **Set up Environment Variables:**
    -   Create a new file in the root of the project named `.env`.
    -   Add your Gemini API key to this file:
        ```env
        GEMINI_API_KEY=your_gemini_api_key_here
        ```

5.  **Seed the Database:**
    -   To populate your Firestore database with initial products, categories, and blog posts, run the seed script:
        ```bash
        npm run db:seed
        ```

6.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Project Structure

-   `src/app/`: Contains all routes and pages (using Next.js App Router).
-   `src/actions/`: Server Actions for all backend logic (e.g., creating orders, updating products).
-   `src/ai/`: Contains all Genkit flows for AI functionality.
-   `src/components/`: Shared React components.
-   `src/context/`: Global state management (Auth, Cart, Wishlist).
-   `src/hooks/`: Custom React hooks.
-   `src/lib/`: Core utilities, Firebase configuration, and data fetching functions.
-   `scripts/`: Node.js scripts for administrative tasks like seeding the database.

### Deployment

To deploy this application to Vercel, please follow the detailed instructions in the **[VERCEL_ENV_GUIDE.md](./VERCEL_ENV_GUIDE.md)** file. It provides a complete list of all the environment variables you need to configure in your Vercel project settings.

### Project Status & Roadmap

This section outlines the current state of the project and planned future enhancements.

#### Implemented Features

-   **Full E-commerce Functionality:** Complete user authentication, role-based access (admin, moderator, user), product browsing, cart management, wishlist, and checkout with automatic stock management.
-   **Comprehensive Admin & Moderator Dashboards:** Tools for managing products, users, orders, and a queue for moderating user-submitted reviews.
-   **Core AI Features (Genkit):**
    -   **AI Skincare Advisor:** A customer-facing tool that generates personalized skincare routines based on user input.
    -   **AI Product Description Generator:** An admin tool to assist in writing marketing copy for new products.
-   **New Product Catalog:** The database has been seeded with an extensive catalog covering Face Care, Hair Care, Body Care, and Fragrance & Wellness.
-   **Secure Firestore Rules:** The database is protected with rules that restrict data access based on user roles and ownership.

#### Planned Future Enhancements

The following features are part of the long-term vision for the application and are not yet implemented:

-   **Advanced Genkit Features:**
    -   **Ingredient Scanner:** A tool for users to upload a photo of an ingredient label and receive an AI-powered explanation of each component.
    -   **Routine Tracker:** An interactive feature for users to track their routine adherence and receive AI-driven feedback and reminders.
-   **Marketing & Localization Features:**
    -   **Routine Bundles:** The ability for admins to create and sell pre-packaged product bundles.
    -   **Subscription Plans:** A recurring payment and delivery system for customers.
    -   **Multi-language Support:** Full localization of the storefront, starting with Swedish and English.
