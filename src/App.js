import React from "react";
import { Switch, Route } from "react-router-dom";
import CallChatPage from "./components/views/CallChatPage/CallChatPage";
import EmailCertificationPage from "./components/views/EmailCertificationPage/EmailCertificationPage";
import Footer from "./components/views/Footer/Footer";
import GroupChatPage from "./components/views/GroupChatPage/GroupChatPage";
import HistoryChatPage from "./components/views/HistoryChatPage/HistoryChatPage";
import HistoryChatRoomPage from "./components/views/HistoryChatPage/HistoryChatRoomPage";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import MyChatPage from "./components/views/MyChatPage/MyChatPage";
import NavBar from "./components/views/NavBar/NavBar";
import NewPasswordPage from "./components/views/NewPasswordPage/NewPasswordPage";
import ProfilePage from "./components/views/ProfilePage/ProfilePage";
import ProfileUpdatePage from "./components/views/ProfilePage/ProfileUpdatePage";
import RandomChatPage from "./components/views/RandomChatPage/RandomChatPage";

import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import ResetPasswordPage from "./components/views/ResetPasswordPage/ResetPasswordPage";
import UpdatePasswordPage from "./components/views/UpdatePasswordPage/UpdatePasswordPage";

import Auth from "./hoc/Auth.js";

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route path="/" exact component={Auth(LandingPage, null)} />
          <Route path="/login" exact component={Auth(LoginPage, false)} />
          <Route path="/register" exact component={Auth(RegisterPage, false)} />
          <Route
            path="/email/certificate"
            exact
            component={Auth(EmailCertificationPage, true)}
          />
          <Route
            path="/reset/password"
            exact
            component={Auth(ResetPasswordPage, false)}
          />
          <Route
            path="/update/password"
            exact
            component={Auth(UpdatePasswordPage, true)}
          />
          <Route
            path="/tmp/password/:id"
            exact
            component={Auth(NewPasswordPage, false)}
          />

          <Route
            path="/group/chat"
            exact
            component={Auth(GroupChatPage, true)}
          />

          <Route
            path="/random/chat"
            exact
            component={Auth(RandomChatPage, true)}
          />

          <Route
            path="/user/profile/:id"
            exact
            component={Auth(ProfilePage, true)}
          />

          <Route
            path="/user/update"
            exact
            component={Auth(ProfileUpdatePage, true)}
          />

          <Route
            path="/video/chat"
            exact
            component={Auth(CallChatPage, true)}
          />

          <Route
            path="/historyChat"
            exact
            component={Auth(HistoryChatPage, true)}
          />

          <Route
            path="/historyChatRoom/:roomId/:roomname"
            exact
            component={Auth(HistoryChatRoomPage, true)}
          />

          <Route path="/mychat/page" exact component={Auth(MyChatPage, true)} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
