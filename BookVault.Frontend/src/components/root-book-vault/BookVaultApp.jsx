import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

import LandingPage from '../landing-page/LandingPage'
import CreateBook from '../create-books/CreateBook';
import AllBooks from '../all-books/AllBooks';
import EditBooks from '../edit-books/EditBooks';
import Auth from '../auth/Auth';
import ProtectedRouter from '../protected-router/ProtectedRouter';
import { UserProvider } from '../../context/UserContext';
import Layout from '../layout/layout';
import ContactForm from '../contact/ContactForm';
import FAQPage from '../faqs/FAQPage';
import ProfileSettings from '../profile-settings/ProfileSettings';
import BookReadingBorad from '../book-reading-board/BookReadingBorad';

export default function BookVaultApp() {

    const router = createBrowserRouter (
    createRoutesFromElements(
      <Route element={<Layout />}>
        {/* Protected route wrapper for authentication */}
        <Route element={ <ProtectedRouter /> }>
          <Route path="/" element={<LandingPage />} />
          <Route path="/" element={<AllBooks />} />
          <Route path="/create" element={<CreateBook />} />
          <Route path="/edit/:id" element={<EditBooks />} />
          <Route path="/search" element={<AllBooks />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/read/:id" element={<BookReadingBorad />} />
        </Route>

        {/* Public routes */}
        <Route path="/auth" element={ <Auth /> } /> 

        {/* Fallback for undefined routes */}
        <Route path="*" element={
          <div>
            <header>
              <h1>Path is Not Found!</h1> 
            </header>
            <p>
              <a href="/auth">Back to Home</a>
            </p>
          </div>
        } />
      </Route>
    )
  )

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
