import React, { useState } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase-config'; // Import the Firebase auth service
import { Link } from "react-router-dom";
import RC from "../../asset/RC.png";
import RCBackground from "../../asset/rc1.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { NoEncryption } from '@mui/icons-material';

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, loginEmail + "@admin.rog.edu", loginPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        // alert('Login successful. User ID: ' + user.uid);
        window.location.href = "Dashboard"; // Replace with the actual URL of your admin dashboard
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Login error: ' + errorMessage);
        setErrorMessage(errorMessage);
        setLoginEmail('');
        setLoginPassword('');
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, signupEmail + "@admin.rog.edu", signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        alert('Sign-up successful. User ID: ' + user.uid);
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Sign-up error: ' + errorMessage);
        setErrorMessage(errorMessage);
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      // User is signed out, handle as needed
    }
  });

  return (
    <>
      <section
        className="background"
        style={{
          backgroundImage: `url(${RCBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // height: '100vh',
        }}
      >
       <div className="white-tint-gradient" />
        <section className="vh-100 gradient-custom">

          <div className="container h-20">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div
                className="login-container"
                style={{
                  height: "20vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "50px",
                  opacity: 0.95
                }}
              >
                <form
                  onSubmit={handleLogin}
                  className="card"
                  style={{
                    borderRadius: "2rem",
                    backgroundColor: "#1e329d",
                    WebkitTextFillColor: "white",
                    width: "80%",
                    marginTop: "20px",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >

                <div className="card-body p-3 text-center">
                  <div className=" m-3">
                    <img src={RC} alt="" style={{ width: 175}} />
                    <h3 className="fw-bold pb-0 text-Sentence m-0">
                      Rogationist College
                    </h3>
                <p className="ext-white-50 fs-9 mb-0 mt-0">
                  Mobile-based Student Diary Manager
                </p>
                <div className="mt-5 text-center">
                  <p className="fw mb-1" style={{ fontFamily: 'Poppins', fontSize: "30px",fontWeight: "bold" }}>Welcome Back!</p>
                </div>
                <div className="card-body p-0 text-center">
                  <div className="form-outline text-start form-white mb-0" style={{ justifyContent: "flex-start", borderRadius: "0.5rem", width: "100%",
                        marginTop: "20px", textDecorationColor: "black", position: 'relative' }}>
                    <label className="form-label" htmlFor="typeEmailX" style={{ fontFamily: 'Poppins, sans-serif', fontSize: "11px" }}>
                      Username
                    </label>
                    <input
                      type="text"
                      id="login-email"
                      name="login-email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="form-control form-control-lg"
                      style={{ WebkitTextFillColor: "black", paddingLeft: '40', margin: '10', borderRadius: '0.5rem', }}
                    />
                  </div>

                  <div className="form-outline text-start form-white mb-1" style={{ position: 'relative', width: "70vh"}}>
                    <label className="form-label" htmlFor="typePasswordX" style={{ fontFamily: 'Poppins, sans-serif', fontSize: "11px" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      id="login-password"
                      name="login-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="form-control form-control-lg"
                      style={{ WebkitTextFillColor: "black", paddingLeft: '40', margin: '10', borderRadius: '0.5rem', }}     
                    />
                  </div>

            <p className="small text-end p-1">
              {/* <a className="text-white-50" href="#!" style={{ textDecoration: "none", fontFamily: 'Poppins, sans-serif' }}>
               Forgot password?
              </a> */}
              {/* <Link to="/forgot-password" className="text-white-50" style={{ textDecoration: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '10px' }}>
                Forgot password?
              </Link> */}

            </p>
          </div>

                    {/* <Link
                      to="/dashboard"
                      className="d-block btn btn-outline-light btn-lg ">
                      Login
                    </Link> */}
                    
                    {/* <button type="submit" style={{ marginTop: '5px', fontFamily: 'Poppins, sans-serif', 
                    fontWeight: "bold", backgroundColor: "#1a2b85",}}>
                                LOGIN
                    </button> */}

                      <Button
                        type="submit" variant="info"
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: "bold",
                          backgroundColor: "#1a2b85",
                          border: "none",
                          padding: "0.5rem",
                          width: "50%"
                        }}>
                        LOGIN
                      </Button>
                  </div>
               </div>
              </form>
            </div>
          </div>
          </div>
       
        </section>
        </section>
        
    </>
    
  );
}

export default Login;