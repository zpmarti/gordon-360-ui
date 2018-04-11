import Grid from 'material-ui/Grid';
import Card, { CardContent, CardHeader, CardActions, CardText } from 'material-ui/Card';
import React, { Component } from 'react';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { LinearProgress } from 'material-ui/Progress';
import Text from 'material-ui/Text';

import './orientation.css';
import { Subheader } from 'material-ui/Subheader';

export default class Orientation extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
      let residenceAvatar;
      let residenceSubheader;
      let residenceText;
      let surveyStatus;
      let requestProcessed;
      let tasksComplete = Math.round(Math.random() * 100);
      let tasksTotal = Math.round(Math.random() * 100);
      if (tasksTotal < tasksComplete) tasksComplete = tasksTotal;

      if ((surveyStatus==true)&&(requestProcessed==true))
      {
          residenceAvatar = 'green-avatar';
          residenceSubheader = 'Completed!';
          residenceText = "Your housing assignment has been made! /*[insert housing string here?] [Welcome to _____ Hall!]*/ Contact Housing@gordon.edu if you need to update your information, or if you have a question.";
      }
      else if((surveyStatus==true)&&(requestProcessed==false))
      {
        residenceAvatar = 'yellow-avatar';
        residenceSubheader = 'Received, in process';
        residenceText = "We’ve received your Housing Information Questionnaire, and the Housing Director will be working to accommodate your housing request. Assignments will be confirmed by Gordon email starting in mid-summer. Contact Housing@gordon.edu if you need to update your information, or if you have a question.";
      }
      else if(surveyStatus==false)
      {
          residenceAvatar = 'red-avatar';
          residenceSubheader = 'Not yet complete.';
          residenceText = "Complete the Housing Information Questionnaire. /*hyperlink to questionnaire as found in google doc*/ This provides information to the Housing Director about your on-campus housing, or your request to be a commuting student.";
      }
      

    return (
      <Grid container justify="center">
        <Grid item xs={12}>
          <figure>
            <figcaption>
              <h3>Tasks Complete</h3>
              {tasksComplete} of {tasksTotal}
            </figcaption>
            <LinearProgress
              className="orientation-progress"
              mode="determinate"
              value={tasksComplete / tasksTotal *100}
            />
          </figure>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
               <CardHeader
                avatar={<Avatar className={residenceAvatar} />}
                title="Residence Hall Assigned"
                subheader={<Subheader className={residenceSubheader} />}
              />
            </CardContent>
            <CardActions>
              <IconButton
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <CardText
                text={<Text className={residenceText}/>}
                />
                </CardText>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

