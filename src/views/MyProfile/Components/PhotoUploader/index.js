import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Cropper from 'react-cropper';
import { gordonColors } from '../../../../theme';
import 'cropperjs/dist/cropper.css';

export default class PhotoUploader extends Component {
  constructor(props) {
    super(props);
    this.onDropAccepted = this.onDropAccepted.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
    this.onCropperZoom = this.onCropperZoom.bind(this);
  }

  handlePreviewChange() {
    this.props.handlePreviewChange();
  }

  onDropAccepted(e) {
    this.props.onDropAccepted(e);
  }

  onDropRejected(e) {
    this.props.onDropRejected(e);
  }
  maxCropPreviewWidth() {
    this.props.maxCropPreviewWidth();
  }

  handleCloseSubmit() {
    this.props.handleCloseSubmit();
  }

  handleCloseCancel() {
    this.props.handleCloseCancel();
  }

  handleClose() {
    this.props.handleClose();
  }

  handleResetImage() {
    this.props.handleResetImage();
  }

  toggleImagePrivacy() {
    this.props.toggleImagePrivacy();
  }

  onCropperZoom() {
    this.props.onCropperZoom();
  }

  render() {
    const photoOpen = this.props.photoOpen;
    const image = this.props.image;
    const cropBoxDim = this.props.cropBoxDim;
    const aspectRatio = this.props.aspectRatio;
    const isImagePublic = this.props.isImagePublic;
    const preview = this.props.preview;

    const style = {
      button: {
        background: gordonColors.primary.cyan,
        color: 'white',
      },
    };

    return (
      <Dialog
        open={photoOpen}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="false"
      >
        <DialogTitle id="simple-dialog-title">Update Profile Picture</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {window.innerWidth < 600
              ? 'Tap Image to Browse Files'
              : 'Drag & Drop Picture, or Click to Browse Files'}
          </DialogContentText>
          <DialogContentText>
            <br />
          </DialogContentText>
          {!preview && (
            <Grid container justify="center" spacing="16">
              <Dropzone
                className="dropzone"
                activeClassName="drop-overlay"
                onDropAccepted={() => {
                  this.onDropAccepted(); //what is the parameter?
                }}
                onDropRejected={() => {
                  this.onDropAccepted();
                }}
                // something is very wrong here!
                accept="image/jpeg,image/jpg,image/png"
              >
                <img
                  className="rounded-corners"
                  src={`data:image/jpg;base64,${image}`}
                  alt=""
                  style={{ 'max-width': '200px', 'max-height': '200px' }}
                />
              </Dropzone>
            </Grid>
          )}
          {preview && (
            <Grid container justify="center" spacing="16">
              <Cropper
                ref="cropper"
                src={preview}
                style={{
                  'max-width': this.maxCropPreviewWidth(),
                  'max-height': this.maxCropPreviewWidth() / aspectRatio,
                }}
                autoCropArea={1}
                viewMode={3}
                aspectRatio={1}
                highlight={false}
                background={false}
                zoom={this.onCropperZoom()}
                zoomable={false}
                dragMode={'none'}
                minCropBoxWidth={cropBoxDim}
                minCropBoxHeight={cropBoxDim}
              />
            </Grid>
          )}
          {preview && <br />}
          {preview && (
            <Grid container justify="center" spacing="16">
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    this.handlePreviewChange();
                  }}
                  style={style.button}
                >
                  Choose Another Image
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <Tooltip
                classes={{ tooltip: 'tooltip' }}
                id="tooltip-hide"
                title={
                  isImagePublic
                    ? 'Only faculty and police will see your photo'
                    : 'Make photo visible to other students'
                }
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    this.toggleImagePrivacy();
                  }}
                  style={style.button}
                >
                  {isImagePublic ? 'Hide' : 'Show'}
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip
                classes={{ tooltip: 'tooltip' }}
                id="tooltip-reset"
                title="Restore your original ID photo"
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    this.handleResetImage();
                  }}
                  style={{ background: 'tomato', color: 'white' }}
                >
                  Reset
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  this.handleCloseCancel();
                }}
                style={style.button}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Tooltip
                classes={{ tooltip: 'tooltip' }}
                id="tooltip-submit"
                title="Crop to current region and submit"
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    this.handleCloseSubmit();
                  }}
                  disabled={!preview}
                  style={preview ? style.button : { background: 'darkgray', color: 'white' }}
                >
                  Submit
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }
}
