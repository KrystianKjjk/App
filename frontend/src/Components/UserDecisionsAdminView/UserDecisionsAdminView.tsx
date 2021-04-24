import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import { FlexContainer, Container } from './UserDecisionsAdminView-style';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useHistory } from "react-router";

interface UserDecisionsAdminViewProps {
  // id?: string;
}

const UserDecisionsAdminView: React.FC<UserDecisionsAdminViewProps> = () => {
  const history = useHistory();
  const [usersDecisions, setUsersDecisions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scenario, setScenario] = useState<any>('');

  const fetchData = async (id:string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hackathon-backend-application.herokuapp.com/api/scenarios/${id}`
      );
      let data = await response.json();
      setUsersDecisions(data.quests);
      setScenario(data.description);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const id = window.localStorage.getItem('toRoute');
    console.log(id)
    if(id){
fetchData(id);
    };
  }, []);

  return (
    <>
      <Grid container direction="row">
        <Grid container item justify="center" xs={12} alignContent="center">
          <Typography variant="h2">
            {scenario}
          </Typography>
          {usersDecisions.map((quest: any, id: number) => {
            return (
              <Grid
                container
                item
                justify="center"
                xs={12}
                alignContent="center"
              >
                <Typography variant="h2" key={id}>
                  <span>Zadanie:</span> {quest.name}
                </Typography>
                <Grid container item justify="center" xs={12}>
                  {quest.decisions.map((decisions: any, id: number) => {
                    return (
                      <FlexContainer key={id}>
                        <h3>
                          <span>Ścieżka: </span> {decisions.title}
                        </h3>
                        {decisions.risk < 40 ? (
                          <ListItem>
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                              Ryzyko decyzji:{' '}
                            </span>
                            {decisions.risk}
                          </ListItem>
                        ) : (
                          <ListItem>
                            <span
                              style={{ color: '#31c35d', fontWeight: 'bold' }}
                            >
                              Ryzyko decyzji:{' '}
                            </span>
                            {decisions.risk}
                          </ListItem>
                        )}

                        <Grid container item justify="center" xs={12}>
                          {decisions.users.map((user: any, id: number) => {
                            return (
                              <Container key={id}>
                                <h4 key={id}>Użytkownicy</h4>
                                <ListItem>
                                  {user.name} {user.surname}
                                </ListItem>
                                <ListItem>
                                  <span>Id użytkownika: </span> {user._id}
                                </ListItem>
                              </Container>
                            );
                          })}
                        </Grid>
                      </FlexContainer>
                    );
                  })}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <button onClick={() => {
        history.push("/teamsManagement");
        window.localStorage.removeItem('toRoute');
        }}>Powrót do zespołów</button>
    </>
  );
};

export default UserDecisionsAdminView;
