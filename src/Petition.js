import React, { Component } from 'react'

import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/themes/theme-c137.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Petition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.id,
            title: this.props.title,
            img: this.props.img,
            desc: this.props.desc,
            date: this.props.date,
            sreq: this.props.sreq,
            scurr: this.props.scurr,
            sigs: this.props.sigs,

            petitionC: this.props.petitionC,
            account: this.props.account,

            didSign: false
        }

        toast.configure()
    }

    async loadPetDetails() {
        const isSigned = await this.state.petitionC.methods.hasSignedPetition(this.state.id
        , this.state.account).call()

        console.log(isSigned)

        if(isSigned) {
            this.setState({didSign: true})
        }
    }

    componentDidMount() {
        this.loadPetDetails()
    }

    render() {
        const progress = (parseInt(this.state.scurr)/parseInt(this.state.sreq)) * 100
        return (
            <div style = {{
                overflow: "hidden",
                borderRadius: "40px",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "white",
                maxWidth: "40vw",
                minWidth: "300px",
                padding: "25px",
                marginBlockStart: "20px",
                marginInlineStart: "10px",
                marginInlineEnd: "10px",
                color: "#584B53"
            }}>
                <h1>{this.state.title}</h1>
                <img src = {this.state.img} style = {{
                    maxWidth: "50vw",
                    maxHeight: "50vh",
                    borderRadius: "40px",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                }} />
                <h3>{this.state.desc}</h3>
                {/* <p>{this.state.sigs}</p> */}

                <p>{this.state.scurr} out of {this.state.sreq} signatures</p>
                <div style = {{height: "20px", width: "30vw", minWidth: "200px",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    borderRadius: "40px",
                    marginBottom: "30px"
                }}>
                    <div style = {{
                        background: "#9D5C63",
                        height: "20px",
                        width: `${progress}%`,
                        borderRadius: "40px"
                    }}></div>
                </div>

                <p>Made on {this.state.date}</p>

                {!this.state.didSign ?
                <AwesomeButton style = {{width: "35vw"}} type = "primary"
                    onPress = {() => {
                        this.state.petitionC.methods.signPetition(this.state.id).send({
                            from: this.state.account
                        }).then((result) => {}, (error) => {
                            console.log(error);
                            toast.error(error.toString(), {position: toast.POSITION.BOTTOM_RIGHT})
                        })

                        this.props.callbackPet("Signed")

                    }}>Sign This Petition</AwesomeButton> : <h3 style = {{
                        color: "#4a8749"
                    }}
                    >You Signed This Petition</h3>}

            </div>
        )
    }
}

export default Petition;
