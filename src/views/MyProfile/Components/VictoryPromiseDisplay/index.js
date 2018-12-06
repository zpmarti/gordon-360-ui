import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import { gordonColors } from '../../theme';
import GordonLoader from '../../components/Loader';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default class VictoryPromiseDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intellect: 0,
      character: 0,
      leadersip: 0,
      service: 0,
    };
  }
}
