import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonBase from '@material-ui/core/ButtonBase';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import ProfileList from './../../components/ProfileList';
import Office from './../../components/OfficeList';
import EmailIcon from '@material-ui/icons/Email';
import user from './../../services/user';
import activity from './../../services/activity';
import { gordonColors } from '../../theme';
import MyProfileActivityList from './../../components/MyProfileActivityList';
import LinksDialog from './Components/LinksDialog';
import { socialMediaInfo } from '../../socialMedia';
import { Link } from 'react-router-dom';
import './myProfile.css';
import GordonLoader from '../../components/Loader';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import PhotoUploader from './Components/PhotoUploader';

const CROP_DIM = 200; // pixels
//MyProfile
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.onDialogSubmit = this.onDialogSubmit.bind(this);

    this.state = {
      username: String,
      button: String,
      isImagePublic: null,
      image: null,
      preview: null,
      hasNickName: Boolean,
      nickname: String,
      loading: true,
      profileinfo: null,
      officeinfo: null,
      profile: {},
      memberships: [],
      involvementsAndTheirPrivacy: [],
      files: [],
      photoOpen: false,
      cropperData: { cropBoxDim: null, aspectRatio: null },
      socialLinksOpen: false,
      facebookLink: '',
      linkedInLink: '',
      twitterLink: '',
      instagramLink: '',
      isSnackBarOpen: false,
    };
    // unsure if needed or not vvvv
    this.onDropAccepted = this.onDropAccepted.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
  }

  handlePhotoOpen = () => {
    this.setState({ photoOpen: true });
  };

  handleCloseSubmit = () => {
    if (this.state.preview != null) {
      var croppedImage = this.refs.cropper.getCroppedCanvas({ width: CROP_DIM }).toDataURL();
      user.postImage(croppedImage);
      var imageNoHeader = croppedImage.replace(/data:image\/[A-Za-z]{3,4};base64,/, '');
      this.setState({ image: imageNoHeader, photoOpen: false, preview: null });
      window.didProfilePicUpdate = true;
    }
  };

  handleCloseCancel = () => {
    this.setState({ photoOpen: false, preview: null });
  };

  handleResetImage = () => {
    user.resetImage();
    window.didProfilePicUpdate = true;
    this.setState({ photoOpen: false, preview: null });
    this.loadProfile();
  };

  toggleImagePrivacy = () => {
    this.setState({ isImagePublic: !this.state.isImagePublic });
    user.setImagePrivacy(this.state.isImagePublic);
    this.setState({ photoOpen: false, preview: null });
    this.setState({ isSnackBarOpen: true });
  };

  handleSocialLinksOpen = () => {
    this.setState({ socialLinksOpen: true });
  };

  handleSocialLinksClose = () => {
    this.setState({ socialLinksOpen: false });
  };

  handlePreviewChange() {
    this.setState({ preview: null });
  }

  onDialogSubmit(fb, tw, li, ig) {
    // For links that have changed, update this.state
    // and send change to database.
    if (fb !== this.state.facebookLink) {
      this.setState({ facebookLink: fb });
      user.updateSocialLink('facebook', fb);
    }
    if (tw !== this.state.twitterLink) {
      this.setState({ twitterLink: tw });
      user.updateSocialLink('twitter', tw);
    }
    if (li !== this.state.linkedInLink) {
      this.setState({ linkedInLink: li });
      user.updateSocialLink('linkedin', li);
    }
    if (ig !== this.state.instagramLink) {
      this.setState({ instagramLink: ig });
      user.updateSocialLink('instagram', ig);
    }
  }

  changePrivacy() {
    if (this.state.button === 'Make Public') {
      this.setState({ button: 'Make Private' });
    } else {
      this.setState({ button: 'Make Public' });
    }
  }

  maxCropPreviewWidth() {
    const breakpointWidth = 960;
    const smallScreenRatio = 0.75;
    const largeScreenRatio = 0.525;
    const maxHeightRatio = 0.5;
    const aspect = this.state.cropperData.aspectRatio;
    var maxWidth =
      window.innerWidth *
      (window.innerWidth < breakpointWidth ? smallScreenRatio : largeScreenRatio);
    var correspondingHeight = maxWidth / aspect;
    var maxHeight = window.innerHeight * maxHeightRatio;
    var correspondingWidth = maxHeight * aspect;

    if (correspondingHeight > maxHeight) {
      return correspondingWidth;
    } else {
      return maxWidth;
    }
  }

  minCropBoxDim(imgWidth, dispWidth) {
    return (CROP_DIM * dispWidth) / imgWidth;
  }

  onDropAccepted(fileList) {
    var previewImageFile = fileList[0];
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result.toString();
      var i = new Image();
      i.onload = function() {
        if (i.width < CROP_DIM || i.height < CROP_DIM) {
          alert(
            'Sorry, your image is too small! Image dimensions must be at least 200 x 200 pixels.',
          );
        } else {
          var aRatio = i.width / i.height;
          this.setState({ cropperData: { aspectRatio: aRatio } });
          var maxWidth = this.maxCropPreviewWidth();
          var displayWidth = maxWidth > i.width ? i.width : maxWidth;
          var cropDim = this.minCropBoxDim(i.width, displayWidth);
          this.setState({ cropperData: { aspectRatio: aRatio, cropBoxDim: cropDim } });
          this.setState({ preview: dataURL });
        }
      }.bind(this);
      i.src = dataURL;
    }.bind(this);
    reader.readAsDataURL(previewImageFile);
  }

  onDropRejected() {
    alert('Sorry, invalid image file! Only PNG and JPEG images are accepted.');
  }

  onCropperZoom(event) {
    if (event.detail.ratio > 1) {
      event.preventDefault();
      this.refs.cropper.zoomTo(1);
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isSnackBarOpen: false });
  };

  componentWillMount() {
    this.loadProfile();
  }

  hasNickName(profile) {
    let Name = String(profile.fullName);
    let FirstName = Name.split(' ')[0];
    this.setState({ hasNickName: FirstName !== profile.NickName && profile.NickName !== '' });
  }

  async getInvolvementAndPrivacyDictionary(membershipsList) {
    let involvementAndPrivacyDictionary = [];
    for (let i = 0; i < membershipsList.length; i++) {
      let involvement = await activity.get(membershipsList[i].ActivityCode);
      involvementAndPrivacyDictionary.push({
        key: membershipsList[i],
        value: involvement.Privacy,
      });
    }
    return involvementAndPrivacyDictionary;
  }

  async loadProfile() {
    this.setState({ loading: true });
    try {
      const profile = await user.getProfileInfo();
      let profileinfo = (
        <ProfileList profile={profile} myProf={true}>
          {' '}
        </ProfileList>
      );
      let officeinfo = <Office profile={profile} />;
      this.setState({ profileinfo: profileinfo });
      this.setState({ officeinfo: officeinfo });
      this.setState({ profile });
      const [{ def: defaultImage, pref: preferredImage }] = await Promise.all([
        await user.getImage(),
      ]);
      const memberships = await user.getMembershipsAlphabetically(profile.ID);
      const involvementsAndTheirPrivacy = await this.getInvolvementAndPrivacyDictionary(
        memberships,
      );
      const image = preferredImage || defaultImage;
      this.setState({ image, loading: false, memberships, involvementsAndTheirPrivacy });
      this.setState({ isImagePublic: this.state.profile.show_pic });
      this.hasNickName(profile);
    } catch (error) {
      this.setState({ error });
    }
    // Set state of social media links to database values after load.
    // If not empty, add domain name back in for display and buttons.
    this.setState({
      facebookLink:
        this.state.profile.Facebook === null || this.state.profile.Facebook === ''
          ? ''
          : socialMediaInfo.facebook.prefix + this.state.profile.Facebook,
      twitterLink:
        this.state.profile.Twitter === null || this.state.profile.Twitter === ''
          ? ''
          : socialMediaInfo.twitter.prefix + this.state.profile.Twitter,
      linkedInLink:
        this.state.profile.LinkedIn === null || this.state.profile.LinkedIn === ''
          ? ''
          : socialMediaInfo.linkedIn.prefix + this.state.profile.LinkedIn,
      instagramLink:
        this.state.profile.Instagram === null || this.state.profile.Instagram === ''
          ? ''
          : socialMediaInfo.instagram.prefix + this.state.profile.Instagram,
    });
  }

  render() {
    const photoOpen = this.state.photoOpen;
    const aspectRatio = this.state.cropperData.aspectRatio;
    const cropBoxDim = this.state.cropperData.cropBoxDim;
    const isImagePublic = this.state.isImagePublic;
    const preview = this.state.preview;
    const image = this.state.image;

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
    let involvementAndPrivacyList;
    if (this.state.memberships.length === 0) {
      involvementAndPrivacyList = (
        <div>
          <Link to={`/activities`}>
            <Typography variant="body2" className="noInvolvements">
              No Involvements to display. Click here to see Involvements around campus!
            </Typography>
          </Link>
        </div>
      );
    } else {
      involvementAndPrivacyList = this.state.involvementsAndTheirPrivacy.map(
        involvementPrivacyKeyValuePair => (
          <MyProfileActivityList
            Membership={involvementPrivacyKeyValuePair.key}
            InvolvementPrivacy={involvementPrivacyKeyValuePair.value}
          />
        ),
      );
    }

    let linksDialog = (
      <LinksDialog
        onDialogSubmit={this.onDialogSubmit}
        handleSocialLinksClose={this.handleSocialLinksClose}
        {...this.state}
      />
    );

    // Define what icon buttons will display
    // (only the sites that have links in database)
    let facebookButton;
    let twitterButton;
    let linkedInButton;
    let instagramButton;
    let editButton;
    let linkCount = 0; // To record whether or not any links are displayed
    if (this.state.facebookLink !== '') {
      facebookButton = (
        <Grid item>
          <a href={this.state.facebookLink} className="icon" target="_blank">
            {socialMediaInfo.facebook.icon}
          </a>
        </Grid>
      );
      linkCount += 1;
    }
    if (this.state.twitterLink !== '') {
      twitterButton = (
        <Grid item>
          <a href={this.state.twitterLink} className="icon" target="_blank">
            {socialMediaInfo.twitter.icon}
          </a>
        </Grid>
      );
      linkCount += 1;
    }
    if (this.state.linkedInLink !== '') {
      linkedInButton = (
        <Grid item>
          <a href={this.state.linkedInLink} className="icon" target="_blank">
            {socialMediaInfo.linkedIn.icon}
          </a>
        </Grid>
      );
      linkCount += 1;
    }
    if (this.state.instagramLink !== '') {
      instagramButton = (
        <Grid item>
          <a href={this.state.instagramLink} className="icon" target="_blank">
            {socialMediaInfo.instagram.icon}
          </a>
        </Grid>
      );
      linkCount += 1;
    }
    if (linkCount > 0) {
      editButton = (
        <Grid item style={{ marginTop: '5px' }}>
          <a onClick={this.handleSocialLinksOpen} className="edit-icon">
            {socialMediaInfo.edit.icon}
          </a>
        </Grid>
      );
    } else {
      editButton = (
        <Grid item>
          <Button onClick={this.handleSocialLinksOpen} style={style.uncontainedButton}>
            EDIT SOCIAL MEDIA LINKS
          </Button>
        </Grid>
      );
    }

    return (
      <div>
        {this.state.loading && <GordonLoader />}
        {!this.state.loading && (
          <div>
            <Grid container justify="center" spacing="16">
              <Grid item xs={12} lg={10}>
                <Card>
                  <CardContent>
                    <Grid
                      container
                      alignItems="center"
                      align="center"
                      justify="center"
                      spacing="16"
                    >
                      <Grid item xs={6}>
                        <Link to={`/profile/${this.state.profile.AD_Username}`}>
                          <Button style={style.uncontainedButton}>View My Public Profile</Button>
                        </Link>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <ButtonBase
                          onClick={this.handlePhotoOpen}
                          focusRipple
                          alt=""
                          className="profile-image"
                          style={{ 'border-radius': '0.5rem' }}
                        >
                          <img
                            src={`data:image/jpg;base64,${this.state.image}`}
                            alt="Profile"
                            className="rounded-corners"
                            style={{ 'max-height': '200px', 'min-width': '160px' }}
                          />
                          <span className="imageBackdrop" />
                          <GridListTileBar className="tile-bar" title="Photo Options" />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid container align="center" alignItems="center">
                          <Grid item xs={12}>
                            <CardHeader
                              title={
                                this.state.hasNickName
                                  ? this.state.profile.fullName +
                                    ' (' +
                                    this.state.profile.NickName +
                                    ')'
                                  : this.state.profile.fullName
                              }
                              subheader={this.state.profile.Class}
                            />
                            <Grid container spacing="16" align="center" justify="center">
                              {facebookButton}
                              {twitterButton}
                              {linkedInButton}
                              {instagramButton}
                              {editButton}
                            </Grid>
                            {this.state.profile.Email !== '' && (
                              <div
                                style={{
                                  marginTop: '20px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <a href={`mailto:${this.state.profile.Email}`}>
                                  <div
                                    className="email-link-container"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      alignContent: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <EmailIcon
                                      className="email-link"
                                      style={{ marginRight: '0.75rem' }}
                                    />
                                    <Typography className="email-link">
                                      {this.state.profile.Email}
                                    </Typography>
                                  </div>
                                </a>
                              </div>
                            )}
                            <PhotoUploader
                              photoOpen={photoOpen}
                              aspectRatio={aspectRatio}
                              cropBoxDim={cropBoxDim}
                              image={image}
                              isImagePublic={isImagePublic}
                              preview={preview}
                              onDropRejected={this.onDropRejected}
                              onDropAccepted={this.onDropAccepted} // something is very wrong here!
                              handlePreviewChange={this.handlePreviewChange} // something wrong here
                              maxCropPreviewWidth={this.maxCropPreviewWidth}
                              handleClose={this.handleClose}
                              handleCloseSubmit={this.handleCloseSubmit}
                              handleCloseCancel={this.handleCloseCancel}
                              toggleImagePrivacy={this.toggleImagePrivacy}
                              handleResetImage={this.handleResetImage}
                              onCropperZoom={this.onCropperZoom}
                            />
                            <Dialog
                              open={this.state.socialLinksOpen}
                              keepMounted
                              onClose={this.handleSocialLinksClose}
                              aria-labelledby="alert-dialog-slide-title"
                              aria-describedby="alert-dialog-slide-description"
                            >
                              <DialogTitle id="simple-dialog-title">
                                Edit your social media links
                              </DialogTitle>
                              <Typography align="center" variant="caption">
                                Copy and paste your links below
                              </Typography>
                              {linksDialog}
                            </Dialog>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={5}>
                <Grid container spacing={16}>
                  {this.state.profileinfo}
                  {this.state.officeinfo}
                </Grid>
              </Grid>
              <Grid item xs={12} lg={5}>
                <Grid container>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Grid container direction="row" alignItems="center">
                          <Grid item xs={7}>
                            <CardHeader title="Involvements" />
                          </Grid>
                          <Grid item xs={5} align="right">
                            <Link to="/transcript">
                              <Button variant="contained" style={style.button}>
                                Co-Curricular Transcript
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>

                        <List>{involvementAndPrivacyList}</List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <div>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={this.state.isSnackBarOpen}
                autoHideDuration={6000}
                onClose={this.handleClose}
                ContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={
                  <span id="message-id">
                    <CheckCircleIcon
                      style={{
                        marginBottom: '-4.5pt',
                        marginRight: '1rem',
                      }}
                    />
                    Success!
                  </span>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this.handleClose}
                  >
                    <CloseIcon />
                  </IconButton>,
                ]}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
