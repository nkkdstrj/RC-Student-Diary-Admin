import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../../firebase-config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetEmailSent(true);
        setErrorMessage('');
      })
      .catch((error) => {
        const errorMessage = error.message;
        setResetEmailSent(false);
        setErrorMessage(errorMessage);
      });
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label htmlFor="reset-email">Email:</label>
          <input
            type="email"
            id="reset-email"
            name="reset-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>
      {resetEmailSent && <p>Email sent. Check your inbox for instructions.</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
}

export default ForgotPassword;
