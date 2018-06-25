import Divider from 'material-ui/Divider/Divider';
import React, { Component } from 'react';
import ListItem from 'material-ui/List/ListItem';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

export default class Majors extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let content;
    if (this.props.majors) {
      content = this.props.majors.map(major => (
        <div>
          <Typography>{major}</Typography>
        </div>
      ));
    }
    return (
      <div>
        <ListItem>
          <Grid container justify="center">
            <Grid item xs={8}>
              <Typography>Major(s):</Typography>
            </Grid>
            <Grid item xs={4} justify="right">
              {content}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </div>
    );
  }
}