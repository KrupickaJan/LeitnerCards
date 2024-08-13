import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from './components/context/AuthContext';
import { useIsAuthenticated, useIsAdmin } from "./components/context/AuthContext";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UpdateProfile from './components/userspage/UpdateProfile';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import TopicIndex from './components/topicpage/TopicIndex';
import TopicCreate from './components/topicpage/TopicCreate';
import TopicUpdate from './components/topicpage/TopicUpdate';
import PackCreate from './components/packpage/PackCreate';
import PackUpdate from './components/packpage/PackUpdate';
import CardIndex from './components/cardpage/CardIndex';
import CardCreate from './components/cardpage/CardCreate';
import CardUpdate from './components/cardpage/CardUpdate';
import Home from './components/homepage/Home';
import SetQuiz from './components/quizpage/SetQuiz';
import QuestionFirstQuiz from './components/quizpage/Quiz';
import UpdateUser from './components/userspage/UpdateUser';

function AppRoutes() {
  const { isAuthenticated } = useIsAuthenticated();
  const { isAdmin } = useIsAdmin();

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/user/topic" element={isAuthenticated ? <TopicIndex /> : <Navigate to="/login" />} />
      <Route path="/user/topic/create" element={isAuthenticated ? <TopicCreate /> : <Navigate to="/login" />} />
      <Route path="/user/topic/update/:topicName/:topicId" element={isAuthenticated ? <TopicUpdate /> : <Navigate to="/login" />} />
      <Route path="/user/pack/create/:topicId" element={isAuthenticated ? <PackCreate /> : <Navigate to="/login" />} />
      <Route path="/user/pack/update/:packName/:packId" element={isAuthenticated ? <PackUpdate /> : <Navigate to="/login" />} />
      <Route path="/user/card/index/:packName/:packId" element={isAuthenticated ? <CardIndex /> : <Navigate to="/login" />} />
      <Route path="/user/card/create/:packName/:packId" element={isAuthenticated ? <CardCreate /> : <Navigate to="/login" />} />
      <Route path="/user/card/update/:cardId" element={isAuthenticated ? <CardUpdate /> : <Navigate to="/login" />} />
      <Route path="/user/quiz/set" element={isAuthenticated ? <SetQuiz /> : <Navigate to="/login" />} />
      <Route path="/user/quiz" element={isAuthenticated ? <QuestionFirstQuiz /> : <Navigate to="/login" />} />
      <Route path="/update-profile" element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/login" />} />

      {isAuthenticated && isAdmin && (
        <>

          <Route path="/admin/user-management" element={<UserManagementPage />} />
          <Route path="/update-user/:userId" element={<UpdateUser />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className='content'>
            <AppRoutes />
          </div>
          <FooterComponent />
        </div>
      </BrowserRouter>
    </AuthProvider >
  );
}

export default App;