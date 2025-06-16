import { Route, Routes, useLocation } from 'react-router-dom'
import SignUpPage from './pages/Auth/SignUpPage'
import SignInPage from './pages/Auth/SignInPage'
import HomePage from './pages/Home/HomePage'
import NavbarPage from './components/NavbarPage'
import FooterPage from './components/FooterPage'
import OrganizerPage from './pages/Participation/OrganizerPage'
import ParticipantPage from './pages/Participation/ParticipantPage'
import EventList from './components/event/EventList'
import EventDetail from './components/event/EventDetail'
import EventCreatePage from './pages/Event/EventCreatePage'
import EventEdit from './components/event/EventEdit'
import ActivateAccountPage from './pages/Auth/ActivateAccountPage'
import ForgetPasswordPage from './pages/Auth/ForgetPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import ResendConfirmationEmailPage from './pages/Auth/ResendEmailConfirmationPage'
import ProfileMyPage2 from './pages/Profile/ProfileMyPage2'
import EventSearchListPage from './components/event/EventSearchListPage';
import MyEventsPage from './pages/Event/MyEventsPage';
import CategoryEventsPage from './pages/Event/CategoryEventsPage'
import MentionsLegalesPage from './pages/Home/MentionsLegalesPage';


export default function App() {
  const location = useLocation();
  const noNavBarPaths = ['/signin', '/signup', '/forgot-password', '/resend-confirmation-email'];

  // making a variable including the array and also the dynamyc paths!
  const isNoNavBarPath = noNavBarPaths.includes(location.pathname) || location.pathname.startsWith('/activate-account/') || location.pathname.startsWith('/reset-password/');

  return (
    <>
      {!isNoNavBarPath && <NavbarPage />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/organizer' element={<OrganizerPage />} />
        <Route path='/participant' element={<ParticipantPage />} />
        <Route path="/event/edit/:id" element={<EventEdit />} />
        <Route path='/event/:id' element= {<EventDetail />} />
        <Route path='/eventlist' element={<EventList />} />
        <Route path='/eventform' element={<EventCreatePage />} />
        <Route path='/my_profile' element={<ProfileMyPage2 />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/activate-account/:token' element={<ActivateAccountPage />} />
        <Route path='/forgot-password' element={<ForgetPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/resend-confirmation-email' element={<ResendConfirmationEmailPage />} />
        <Route path='/search' element={<EventSearchListPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/category/:categoryId" element={<CategoryEventsPage />} />
        <Route path="/legal" element={<MentionsLegalesPage />} />
      </Routes>
      {!isNoNavBarPath && <FooterPage />}
    </>
  )
}

