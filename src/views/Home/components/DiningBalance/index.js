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
    let initBal = [];
    let currBal = [];
    const diningInfo = await user.getDiningInfo();
    console.log(diningInfo);
    for (let i = 0; i < diningInfo.length; i += 1) {
      initBal.push(diningInfo[i].InitialBalance);
      currBal.push(diningInfo[i].CurrentBalance);

      this.setState({
        initBalance: initBal,
        currentBalance: currBal,
      });
    }
  }

  render() {
    const diningStuff = this.state.currentBalance.map(result => <Typography>{result}</Typography>);
    console.log(this.state.currentBalance);
    return (
      <Card>
        <Typography>Dining Balance</Typography>
        {diningStuff}
      </Card>
    );
  }
}
