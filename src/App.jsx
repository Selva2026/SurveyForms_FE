import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateSurvey from './pages/CreateSurvey';
import NavBar from './pages/NavBar';
import ParticipateSurvey from './pages/ParticipateSurvey';
import MySurvey from './pages/MySurvey';
import SurveyAnalytics from './pages/SurveyAnalytics';



const App = () => {


  return (
    
      <BrowserRouter>

      <NavBar/>

      <Routes>

<Route path="/" element={ <Login/>}  />
<Route path="/register" element={ <Register/>} />
<Route path="/dashboard" element={ <Dashboard/>}/>
<Route path="/create" element = {<CreateSurvey/>} />
<Route path="/survey/:id" element={<ParticipateSurvey />} />
<Route path="/mysurvey" element = {<MySurvey/>} />
<Route path="/analytics/:id" element = {<SurveyAnalytics/>} />


      </Routes>

      </BrowserRouter>
  
 
    
  )
}

export default App
