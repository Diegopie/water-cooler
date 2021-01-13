import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketProvider } from './utils/SocketProvider';
import { ChatProvider } from './utils/ChatProvider';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import GameRPG from './pages/depreciated/GameRPG';
import Homepage from './pages/Homepage';
import Landing from './pages/Landing';
import Login from './pages/depreciated/Login';
import LoginModal from './components/Modals/LoginModal';
// import Navbar from './components/depreciated/Navbar';
import Profile from './pages/Profile';
import Search from './pages/depreciated/Search';
import SideNav from './components/NavbarComponents/SideNav';
import Signup from './pages/depreciated/Signup';
import Slider from './components/SidebarComponents/Slider';
import SocialSpace from './pages/SocialSpace';
import UserRoom from './pages/UserRoom';
import { useGlobalContext } from './utils/GlobalContext';
import 'bootstrap/dist/css/bootstrap.min.css';
// Temporary pages 
import RoomGUI from './pages/RoomGUI';
import Space from './pages/Space';

import Loading from './components/Loading';


import { Container } from 'react-bootstrap';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

    const [{ USER },] = useGlobalContext();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
    }, []);

    if (!USER) {

        if(loading) {
            return <Loading />;
        } 
        return (
            <Router>
                <main>
                    <Route exact path="/">
                        <Landing />
                        <LoginModal />
                        <ToastContainer transition={Zoom} autoClose={2000} />
                    </Route>
                    <Route path="*">
                        <Redirect to='/' />
                    </Route>
                </main>
            </Router>
        );
    
    }


    return (
        <Router>
          
            <SocketProvider>
                <ChatProvider>
                  
                    <SideNav />
                    
                    <ToastContainer transition={Zoom} autoClose={3000} />

                    <main>
                        <Slider />
                        <Container>
                            <Switch>
                                <Route exact path='/' component={Homepage} />
                                <Route exact path='/signup' component={Signup} />
                                <Route exact path='/login' component={Login} />
                                <Route exact path='/search' component={Search} />
                                {/* will be profile:id */}
                                <Route exact path='/profile' component={Profile} />
                                <Route exact path='/rooms/:id' component={RoomGUI} />
                                {/* will be socialspace:id */}
                                <Route exact path='/rooms/:id/:id' component={SocialSpace} />
                                {/* Temporary Game Page  */}
                                <Route exact path='/game' component={GameRPG} />
                                {/* Temporary RoomUser Page */}
                                <Route exact path='/room' component={RoomGUI} />
                                {/* Temporary Social Space Page  */}
                                <Route exact path='/space' component={Space} />
                            </Switch>
                        </Container>
                    </main>
                    <Footer />
                 
                </ChatProvider>
            </SocketProvider>

        </Router>
    );
}

export default App;