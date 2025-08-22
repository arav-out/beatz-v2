
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback,} from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout.tsx";
import ChatPage from "./pages/chat/ChatPage.tsx";
import AlbumPage from "./pages/album/AlbumPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage.tsx";
import LikedSongsPage from "./pages/likedsongs/LikedSongsPage.tsx";
import { SignUpForm } from "./components/SignUpFrom.tsx";
import { SignInForm } from "./components/SignInForm.tsx";
import Test from "./Test.tsx";

import AddFriendPage from "./pages/addfrnds/AddFriendPage.tsx";








function App() {

  return (
    <>
<Routes >  

<Route 
path='/sso-callback'
 element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"}/>}
  />
<Route path="/auth-callback" element={<AuthCallbackPage />} /> 
<Route path="/admin" element={<AdminPage />} /> 

<Route element={ <MainLayout />}>

<Route path="/" element={<HomePage />} />
<Route path="/chat" element={<ChatPage />} />
<Route path="/albums/:albumId" element={<AlbumPage />} />
<Route path="*" element={<NotFoundPage />} />
<Route path="/liked-songs" element={<LikedSongsPage />} />
<Route path="/sign-up" element={<SignUpForm />} />
<Route path="/sign-in" element={<SignInForm />} />
<Route path="/user-test" element={<Test />} />
<Route path="/add-friend" element={<AddFriendPage />} />
</Route>
</Routes>  
<Toaster/>
</>
  );
}

export default App;
