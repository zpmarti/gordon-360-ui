import React, { Component } from 'react';
//import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
//import { CardContent } from '@material-ui/core';
//import { Button } from '@material-ui/core';
//import { gordonColors } from '../../../../theme';
import user from '../../../../services/user';

export default class DiningBalance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initBalance: [],
      currentBalance: [],
    };
  }
  componentWillMount() {
    this.loadData();
  }

  async loadData() {
    const diningInfo = await user.getDiningInfo();
    this.setState({
      initBalance: diningInfo.InitialBalance,
      currentBalance: diningInfo.CurrentBalance,
    });
  }

  render() {
    console.log(this.state.initBalance);
    console.log(this.state.currentBalance);
    return (
      <Card>
        <Typography>Dining Balance</Typography>
        <Typography>
          {this.state.initBalance} {this.state.currentBalance}
        </Typography>
      </Card>
    );
  }
}
