import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { gordonColors } from '../../theme';
import residence from '../../services/residence.js';

import './orientation.css';

export default class Orientation extends Component {
  state = {
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const style = {
      img: {
        width: '200px',
        height: '200px',
      },

      centerGridContainer: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
      },

      button: {
        background: gordonColors.primary.cyan,
        color: 'white',
      },
      uncontainedButton: {
        color: gordonColors.primary.cyan,
      },
    };
    let residenceAvatar;
    let residenceSubheader;
    let residenceText;
    //let surveyCompleted = false; surveyCompleted will be added back in when we have the ability to check it. (We'd need to check if any of the 4 residence hall surveys were completed.)
    let housingButton;
    let tasksComplete = 5;
    let tasksTotal = 10;
    if (tasksTotal < tasksComplete) tasksComplete = tasksTotal;

    if (/*(surveyCompleted === true) && */ residence.requestProcessed()) {
      residenceAvatar = 'green-avatar';
      residenceSubheader = 'Completed!';
      residenceText =
        'Your housing assignment has been made! ' /*[insert housing string here?] [Welcome to _____ Hall!]*/ +
        'Contact Housing@gordon.edu if you need to update your information, or if you have a question.';
    }
    // else if ((surveyCompleted === true) && (requestProcessed === false)) {
    //   residenceAvatar = 'yellow-avatar';
    //   residenceSubheader = 'Received, in process';
    //   residenceText = "We’ve received your Housing Information Questionnaire, and the Housing Director will be working to accommodate your housing request. Assignments will be confirmed by Gordon email starting in mid-summer. Contact Housing@gordon.edu if you need to update your information, or if you have a question.";
    // }
    else if (!residence.requestProcessed()) {
      /*surveyCompleted === false-- won't work without the data that I don't have.*/
      residenceAvatar = 'red-avatar';
      residenceSubheader = 'Not yet complete.';
      housingButton = (
        <a href={'https://www.gordon.edu/housingquestionnaire'} className="icon" target="_blank">
          <Button style={style.uncontainedButton}> Housing Information Questionnaire </Button>
        </a>
      );
      residenceText =
        'Complete the Housing Questionnaire. This provides information to the Housing Director about your on-campus housing, or your request to be a commuting student.';
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
              variant="determinate"
              value={(tasksComplete / tasksTotal) * 100}
            />
          </figure>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CardHeader
                avatar={<Avatar className={residenceAvatar} />}
                title="Residence Hall"
                subheader={<ListItemText className={residenceSubheader} />}
              />
            </CardContent>
            <CardActions>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show more"
                />
              </ExpansionPanel>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Grid item xs={6}>
                  {housingButton}
                </Grid>
                <Typography>{residenceText}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
