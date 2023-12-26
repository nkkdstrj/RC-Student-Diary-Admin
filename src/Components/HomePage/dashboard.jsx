import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Card from "./card";
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebase-config'; // Replace this with the correct path to your firebase-config

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReminders, setTotalReminders] = useState(0);

  useEffect(() => {
    // Fetch Number of Users
    const usersRef = ref(getDatabase(app), 'Users');
    const usersQuery = usersRef;

    const unsubscribeUsers = onValue(usersQuery, (snapshot) => {
      if (snapshot.exists()) {
        let count = 0;
        snapshot.forEach(() => {
          count++;
        });
        setTotalUsers(count);
      } else {
        setTotalUsers(0);
      }
    });

    // Fetch Number of Reminders
    const remindersRef = ref(getDatabase(app), 'PublicReminders');
    const remindersQuery = remindersRef;

    const unsubscribeReminders = onValue(remindersQuery, (snapshot) => {
      if (snapshot.exists()) {
        let count = 0;
        snapshot.forEach(() => {
          count++;
        });
        setTotalReminders(count);
      } else {
        setTotalReminders(0);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeReminders();
    };
  }, []);

  return (
    <>
      <h1 style={{ fontWeight: 'bold' }}>DashBoard</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <Card link="/student/manager" num={totalUsers} desc="NUMBER OF USERS" />
          </div>
          <div className="col-md-6 col-xs-6">
            <Card link="/reminder" num={totalReminders} desc="NUMBER OF REMINDERS" />
          </div>
        </div>
        {/* Add more rows or customize as needed */}
      </div>
    </>
  );
}

export default Dashboard;
