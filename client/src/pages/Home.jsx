import React, { useContext, useEffect, useState} from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';
import {CgEnter} from 'react-icons/cg';
import {RiVideoAddFill} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Groups2Icon from '@mui/icons-material/Groups2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BoltIcon from '@mui/icons-material/Bolt';


import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';


const Home = () => {

  
  const [roomName, setRoomName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('none');
  const [newMeetTime, setNewMeetTime] = useState('none');



  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const {logout} = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  const handleLogIn =() =>{
    navigate('/login');
  }
  
  const handleLogOut =(e)=>{
    e.preventDefault();
    logout();
  }
  

  const {socket, setMyMeets, newMeetType, setNewMeetType} = useContext(SocketContext);

  setNewMeetType('instant');

  const userId = localStorage.getItem("userId");

  const handleCreateRoom = () =>{
    socket.emit("create-room", {userId, roomName, newMeetType, newMeetDate, newMeetTime});
  }

  const handleJoinRoom = async () =>{
    await socket.emit('user-code-join', {roomId: joinRoomId});
    setRoomName('');
  }

  useEffect(() =>{
    socket.on("room-exists", ({roomId})=>{
      navigate(`/meet/${roomId}`); 

    })
    socket.on("room-not-exist", ()=>{
      setJoinRoomId('');
      setJoinRoomError("Room dosen't exist! please try again..");
    })

    socket.emit("fetch-my-meets", {userId});
    socket.on("meets-fetched", async ({myMeets})=>{
      console.log("myMeetsss", myMeets)
      setMyMeets(myMeets);
    })  
  },[socket])

  const userName = localStorage.getItem("userName");


  return (
    <div className='homePage'>
        <div className="homePage-hero">
          <div className="home-header">
              <div className="home-logo">
                <h2 >Smart Meet</h2>
              </div>

          {!userName || userName === 'null' ? 
          
            <div className="header-before-login">
              <button onClick={handleLogIn}>login</button>
            </div>

          :

          <div className="header-before-login">
            <button onClick={handleLogOut}>logout</button>
          </div>
            

        }
          </div>

          <div className="home-container container">

          {!userName || userName === 'null' ? 

            <div className="home-app-intro">
              {/* <span className="welcome">Welcome!!</span> */}
              <h2>Unbounded <b> Connections: </b> Elevate Your Meetings with Free, Future-Forward <b> Video Conferencing!! </b></h2>
              <p>Revolutionize your meetings with our cutting-edge, future-forward video conferencing platform. Experience seamless collaboration, crystal-clear audio, and HD video, all at <b> zero-cost..!!</b>  Elevate your virtual communication and connect without boundaries today!</p>
              <button onClick={handleLogIn}>Join Now..</button>
            </div>


          :
          <>
            <div className="home-app-intro">
            
                <h2>Unbounded Connections: Elevate Your Meetings with Free, Future-Forward Video Conferencing!!</h2>
            </div>
            <div className="home-meet-container">
              <div className="create-meet">
                <input type="text" placeholder='Name your meet...' onChange={(e)=> setRoomName(e.target.value)}  />
                <button   onClick={()=> { setNewMeetType('instant'); handleCreateRoom();}} > New meet</button>
              </div>
              <div className="join-meet">
                <input type="text" placeholder='Enter code...' onChange={(e)=> setJoinRoomId(e.target.value)} />
                <button onClick={handleJoinRoom}>  Join Meet</button>
              </div>
              <span>{joinRoomError}</span>
            </div>


           {/* Modal */}
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" style={{width: "30vw"}}>
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Create New Meet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    
                    {/* <input type='text' class="form-control" placeholder='Name your meet' value={roomName} onChange={(e)=> setRoomName(e.target.value)}  /> */}
                    <div class="form-floating mb-3 ">
                      <input type="text" class="form-control" id="floatingInput" placeholder='Name your meet' value={roomName} onChange={(e)=> setRoomName(e.target.value)} />
                      <label for="floatingInput">Meet name</label>
                    </div>

                    <select class="form-select" aria-label="Default select example" onChange={(e) => setNewMeetType(e.target.value)}>
                      <option  selected>Choose meet type</option>
                      <option value="instant">Instant meet</option>
                      <option value="scheduled">Schedule for later</option>
                    </select>

                    {newMeetType === 'scheduled' ?
                    <>
                    <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Date: </p>
                    <input type='date' class="form-control" onChange={(e) => setNewMeetDate(e.target.value)} />
                    <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Time: </p>
                    <input type='time' class="form-control" onChange={(e) => setNewMeetTime(e.target.value)} />
                    </>
                    :
                    ''
                    }

                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onClick={handleCreateRoom} data-bs-dismiss="modal">Create meet</button>
                  </div>
                </div>
              </div>
            </div>


            </>
  }
          

          </div>
        </div>

        
        <div className="footer">
          <h2>Contact us @: </h2>
          <div className="footer-social-media">
              <GoogleIcon />
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
          </div>
        </div>
        
    </div>
  )
}

export default Home