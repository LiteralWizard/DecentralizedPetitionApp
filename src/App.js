// Mashood Ur Rehman        i16-0063
// Muhammad Raafey Tariq    i16-0259
// IBC Project

import React, {Component} from 'react';

import Web3 from 'web3';

import {PETITIONCONTRACT_ADDRESS, PETITIONCONTRACT_ABI} from './config';

import { elastic as Menu } from 'react-burger-menu';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/themes/theme-c137.css";

import FrontLog from './FrontLog';
import FrontRegister from './FrontRegister';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import Petition from './Petition';

// ################# STYLE CODE BEGIN #################### //

function getFormStyle() {
  const formStyle = makeStyles((theme) => ({
      paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      form: {
        width: '100%',
        marginTop: theme.spacing(1),
      }
  }));

  return formStyle
}

// ################# STYLE CODE END ###################### //

class App extends Component {
  constructor() {
    super()
    this.state = {account: '', username: '', petitionContract: '', contractAddr: '', web3: '', 
      loginV: true,
      accountV: false,
      accountRegForm: false,
      isAdmin: false,
      accountAddForm: false,
      addPetForm: false,
      petitionVis: true,
      newRegUser: false,
      petitions: []
    }
  }

  componentDidMount() {
    this.loadBlockchainData()

    toast.configure();
  }

  async loadBlockchainData() {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    // console.log(web3)
    this.setState({web3: web3})

    this.setState({contractAddr: PETITIONCONTRACT_ADDRESS})

    const accounts = await web3.eth.getAccounts()
    // this.setState({account: accounts[0]})

    const petitionC = new web3.eth.Contract(PETITIONCONTRACT_ABI, PETITIONCONTRACT_ADDRESS)
    this.setState({petitionContract: petitionC})
    // console.log(this.state.petitionContract)

    this.setState({petitions: []})

    // const accAddr = await this.state.petitionContract.methods.getUserSig(accounts[0]).call()
    // console.log(accAddr)

    if(this.state.account === "" && this.state.username !== "" && this.state.newRegUser === false) {
      // console.log(this.state.username)

      const accID = await this.state.petitionContract.methods.getUserIDFromName(this.state.username).call()
      // console.log(accID)

      if(accID === "-1") {
        toast.error("Username does not exist. Consider Registering one", {position: toast.POSITION.BOTTOM_RIGHT})
        this.setState({loginV: true})
      }
      else {
        const accAddr = await this.state.petitionContract.methods.getUserAccount(accID).call()
        // console.log(accAddr)

        if(this.state.username === "admin" && accID === "0") {
          this.setState({isAdmin: true})
        }

        this.setState({account: accAddr})
        this.setState({accountV: true})

        const isSigned = await this.state.petitionContract.methods.hasSignedPetition(0
        , this.state.account).call()

        console.log(isSigned)

        toast.success("Login Successful", {position: toast.POSITION.BOTTOM_RIGHT})
      }
    }

    if(this.state.account === "" && this.state.username !== "" && this.state.newRegUser === true) {
      const uTaken = await this.state.petitionContract.methods.getUserIDFromName(this.state.username).call()
      console.log(uTaken)

      let regConfirmed = true

      if(uTaken === "-1") {
        this.state.petitionContract.methods.createUser(this.state.username).send({from:
          accounts[0], gas: 1000000}).then((result) => {}, (error) => {
            console.log(error)
            
            regConfirmed = false
            // console.log(regConfirmed)

            toast.error(error.toString(), {position: toast.POSITION.BOTTOM_RIGHT})
          })

        setTimeout(() => {
          if(regConfirmed) {
          toast.success("Username Registered. Please login", {position: toast.POSITION.BOTTOM_RIGHT})

          this.setState({loginV: true})
          this.setState({accountRegForm: false})
          this.setState({newRegUser: false})
        }
        }, 1000)

      }
      else {
        toast.error("The Username is Taken", {position: toast.POSITION.BOTTOM_RIGHT})
      }
    }

    if(!this.state.loginV) {
      const petitionNum = await this.state.petitionContract.methods.getNumPetitions().call({
        from: this.state.account
      })

      for(let itr = 0; itr<petitionNum; itr++) {
        let CurrentPet = []

        const PID = await this.state.petitionContract.methods.getPetitionId(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PID)

        const PTitle = await this.state.petitionContract.methods.getPetitionTitle(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PTitle)

        const PURL = await this.state.petitionContract.methods.getPetitionImageUrl(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PURL)

        const PDesc = await this.state.petitionContract.methods.getPetitionDescription(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PDesc)

        const PDate = await this.state.petitionContract.methods.getPetitionDateCreated(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PDate)

        const PSReq = await this.state.petitionContract.methods.getPetitionNumSignaturesRequired(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PSReq)

        const PSCon = await this.state.petitionContract.methods.getPetitionCurrentSignatureCount(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PSCon)

        const PS = await this.state.petitionContract.methods.getPetitionSignatures(itr).call({
          from: this.state.account
        })
        CurrentPet.push(PS)

        this.setState({ petitions: [...this.state.petitions, CurrentPet] })
      }
    }

  }

  getAccount = (accountLogin) => {

    if(accountLogin === "Redirect Code: -1") {
      this.setState({accountRegForm: true})
      console.log(accountLogin)
    }
    else {
      setTimeout(() => {
        this.setState({username: accountLogin})
        console.log(this.state.username)
        this.setState({loginV: false})
  
        this.loadBlockchainData()
      }, 2000)
    }
  }

  registerAccount = (propUsername) => {
    setTimeout(() => {
      this.setState({username: propUsername})
      console.log(this.state.username)
      this.setState({newRegUser: true})

      this.loadBlockchainData()
    }, 2000)
  }

  reloadPetitions = (updatePet) => {
    this.setState({petitionVis: false})

    setTimeout(() => {
      this.setState({petitionVis: true})
      this.loadBlockchainData()
    }, 1000)
  }

  render() {
    const classes = getFormStyle()

    return (
      <div>
        {this.state.loginV && !this.state.accountRegForm ? <FrontLog callbackAcc = {this.getAccount} /> : null}
        {this.state.accountRegForm ? <FrontRegister callbackAcc = {this.registerAccount} /> : null}

        {this.state.accountV ? <div>
          <div>
            <Menu disableAutoFocus pageWrapId = {"page-wrap"} outerContainerId = {"App"}>
              <p>Current User</p>
              <h2>{this.state.username}</h2>

              {this.state.isAdmin ? <AwesomeButton style = {{width: "200px"}} type = "primary"
                onPress = { () => {
                  this.setState({accountAddForm: true})
                }}>
              Add Verified Account</AwesomeButton>: null}

              <AwesomeButton style = {{width: "200px", marginTop: "20px"}} type = "primary"
                onPress = { () => {
                  this.setState({addPetForm: true})
                }}>
              Add New Petition</AwesomeButton>

              <AwesomeButton style = {{width: "200px", marginTop: "100px"}} type = "primary"
                onPress = { () => {
                  this.setState({loginV: true})
                  this.setState({account: ""})
                  this.setState({username: ""})
                  this.setState({isAdmin: false})
                  this.setState({accountV: false})
                  this.setState({accountRegForm: false})
                  this.setState({accountAddForm: false})
                  this.setState({addPetForm: false})
                  this.setState({petitionVis: true})
                  this.setState({newRegUser: false})
                }}>
              Log Out</AwesomeButton>
            </Menu>

            {/* ############################# ADD ACCOUNT FORM START ############################# */}

            <Dialog open={this.state.accountAddForm} onClose={() => {
              this.setState({accountAddForm: false})
            }} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add Account Address</DialogTitle>
              <DialogContent>
                <DialogContentText>
                Add an account address into the pool. This will allow more users to register and sign petitions
                </DialogContentText>
                <form className={classes.form} onSubmit = {(event) => {
                    event.preventDefault()
                    const accountAddAdd = new FormData(event.target).get("accountAddAdd")
                    console.log(accountAddAdd)

                    this.state.petitionContract.methods.addAccount(accountAddAdd).send({
                      from: this.state.account
                    }).then((result) => {}, (error) => {
                      console.log(error);
                      toast.error(error.toString().slice(73), {position: toast.POSITION.BOTTOM_RIGHT})
                    })
                }}>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="accountAddAdd"
                      label="Enter Account Address"
                      type="text"
                      id="accountAddAdd"
                  />
                  <AwesomeButton style = {{width: "20vw", marginRight: "10px", marginBottom: "10px"}} type = "primary">
                    Add This Account</AwesomeButton>
                </form>
                <AwesomeButton onPress={() => {
                    this.setState({accountAddForm: false})
                  }} style = {{width: "20vw", marginBottom: "10px"}} type = "primary">Cancel</AwesomeButton>
              </DialogContent>
            </Dialog>

            {/* ############################# ADD ACCOUNT FORM END ############################### */}

            {/* ############################# ADD PETITION FORM START ############################# */}

            <Dialog open={this.state.addPetForm} onClose={() => {
              this.setState({addPetForm: false})
            }} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Add A New Petition</DialogTitle>
              <DialogContent>
                <DialogContentText>
                Design a Petition to gain support for your cause. Enter details below.
                </DialogContentText>
                <form className={classes.form} onSubmit = {(event) => {
                    event.preventDefault()

                    var D = new Date()
                    var crdate = D.getDate().toString() + "/" + D.getMonth().toString() + "/" + D.getFullYear().toString()

                    const petFormTitle = new FormData(event.target).get("petFormTitle")
                    console.log(petFormTitle)

                    const petFormURL = new FormData(event.target).get("petFormURL")
                    console.log(petFormURL)

                    const petFormDesc = new FormData(event.target).get("petFormDesc")
                    console.log(petFormDesc)

                    const petFormNS = new FormData(event.target).get("petFormNS")
                    console.log(petFormNS)

                    this.state.petitionContract.methods.createPetition(petFormTitle, petFormURL,
                      petFormDesc, crdate, petFormNS).send({
                      from: this.state.account, gas: 1000000
                    }).then((result) => {}, (error) => {
                      console.log(error);
                      toast.error(error.toString().slice(73), {position: toast.POSITION.BOTTOM_RIGHT})
                    })

                    this.setState({addPetForm: false})

                    this.reloadPetitions("Reload")
                }}>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="petFormTitle"
                      label="Title this Petition"
                      type="text"
                      id="petFormTitle"
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="petFormURL"
                      label="Enter an image URL to go with the Petition"
                      type="text"
                      id="petFormURL"
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="petFormDesc"
                      label="Describe the Cause"
                      type="text"
                      id="petFormDesc"
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="petFormNS"
                      label="How many Signatures are Needed?"
                      type="number"
                      id="petFormNS"
                  />
                  <AwesomeButton style = {{width: "20vw", marginRight: "10px", marginBottom: "10px"}} type = "primary">
                    Start Petition</AwesomeButton>
                </form>
                <AwesomeButton onPress={() => {
                    this.setState({addPetForm: false})
                  }} style = {{width: "20vw", marginBottom: "10px"}} type = "primary">Cancel</AwesomeButton>
              </DialogContent>
            </Dialog>

            {/* ############################# ADD PETITION FORM END ############################### */}

            <div id = "page-wrap">

              <div style = {{paddingTop: "10px",color: "#584B53"}}>
                <h1>Hello There</h1>
                <h2 style = {{fontWeight: "normal"}}>{this.state.username}</h2>
                <h1>Welcome To our Petition Portal</h1>
                <h3>Powered by Ethereum Blockchain</h3>
              </div>

              {this.state.petitionVis ? <div style = {{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap"
              }}>
                {this.state.petitions.map(petition => (
                  <Petition
                    id = {petition[0]}
                    title = {petition[1]}
                    img = {petition[2]}
                    desc = {petition[3]}
                    date = {petition[4]}
                    sreq = {petition[5]}
                    scurr = {petition[6]}
                    sigs = {petition[7]}

                    petitionC = {this.state.petitionContract}
                    account = {this.state.account}

                    callbackPet = {this.reloadPetitions}
                  />
                ))}
              </div> : null}

              <Box mt={8}>
                <Typography variant="body2" color="textSecondary" align="center">
                  {"IBC Project | Mashood Ur Rehman | Muhammad Raafey Tariq"}
                </Typography>
              </Box>
            
            </div>

          </div>
        </div> : null}
      </div>
    )
  }
}

export default App;