// Mashood Ur Rehman        i16-0063
// Muhammad Raafey Tariq    i16-0259
// IBC Project

import React, {Component} from 'react'

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-c137.css';

function getLogStyle() {
    const logStyle = makeStyles((theme) => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '100%',
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
    }));

    return logStyle
}

class FrontRegister extends Component {
    Copyright() {
        return (
          <Typography variant="body2" color="textSecondary" align="center">
            {"IBC Project | Mashood Ur Rehman | Muhammad Raafey Tariq"}
          </Typography>
        );
      }

    render() {
        const classes = getLogStyle();

        const BG = "https://images.pexels.com/photos/950241/pexels-photo-950241.jpeg"

        return(
            <div style = {{
                display: "grid",
                placeItems: "center",
                height: "100vh",
                backgroundImage: `url(${BG})`,
                backgroundSize: "cover"
            }}>
                <div style = {{
                    display: "flex",    
                    alignItems: "center",
                    padding: "50px",
                    borderRadius: "40px",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    width: "40%",
                    minWidth: "300px",
                    background: "rgba(255, 255, 255, 0.8)",
                    textAlign: "center",
                }}>
                    <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar} style = {{
                                marginRight: "auto", marginLeft: "auto", padding: "30px"
                            }}>
                            <HowToRegIcon />
                        </Avatar>
                        <Typography style = {{ paddingTop: "20px" }} component="h1" variant="h5">
                            Registration
                        </Typography>
                        <Typography style = {{ paddingTop: "10px" }} component="p" variant="h6">
                            If an account is available we will register your username
                        </Typography>
                        <form className={classes.form} onSubmit = {(event) => {
                                event.preventDefault()
                                const accountName = new FormData(event.target).get("accountName")
                                // console.log(accountName)

                                this.props.callbackAcc(accountName)
                            }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="accountName"
                            label="Enter a Username"
                            type="text"
                            id="accountName"
                        />
                        <AwesomeButton style = {{width: "20vw"}} type = "primary">Register</AwesomeButton>
                        </form>
                    </div>
                    <Box mt={8}>
                        {this.Copyright()}
                    </Box>
                    </Container>
                </div>
            </div>
        )
    }
}

export default FrontRegister;