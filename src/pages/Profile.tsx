import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material'
import { profileUser } from '../services/auth'
import { useAuth } from '../auth/AuthContext'
import decodeToken from '../services/auth'

const classes = {
  card: 'card-class',
  title: 'title-class',
  text: 'text-class',
  avatar: 'avatar-class',
  gridContainer: 'grid-container-class',
  gridItem: 'grid-item-class'
};

 

export default function Profile() {
  const { authToken, employeeId } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileUser(authToken, employeeId);
        console.log("data", data);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [authToken, employeeId]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item>
            <Avatar className={classes.avatar}>
              {profile.firstName?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm container className={classes.gridItem}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="h4" component="h1" className={classes.title}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="body1" className={classes.text}>
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Typography variant="body1" className={classes.text}>
                  <strong>Points:</strong> {profile.points}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
