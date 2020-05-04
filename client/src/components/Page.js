import React, { Component } from "react";
import { Collapse } from "reactstrap";

import Header from "./Margins/Header";
import Footer from "./Margins/Footer";
import About from "./About/About";
import Atlas from "./Atlas/Atlas";

import { HTTP_OK, LOG } from "../utils/constants";
import * as configSchema from "../../schemas/ResponseConfig";
import { getOriginalServerPort, isJsonResponseValid, sendServerRequest } from "../utils/restfulAPI";


export default class Page extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showAbout: false,
			serverSettings: {serverPort: getOriginalServerPort(), serverConfig: null},
		};

		this.toggleAbout = this.toggleAbout.bind(this);
		this.processServerConfigSuccess = this.processServerConfigSuccess.bind(this);

		sendServerRequest(
			'config',
			{ requestType: "config", requestVersion : 1 },
			this.state.serverSettings.serverPort
		).then(config => {
			this.processConfigResponse(config);
		});
	}

	render() {
		return (
			<>
				<Header toggleAbout={this.toggleAbout}/>
				{this.renderAbout()}
				{this.renderAtlas()}
				<Footer
					serverSettings={this.state.serverSettings}
					processServerConfigSuccess={this.processServerConfigSuccess}
				/>
			</>
		);
	}

	renderAbout() {
		return(
			<Collapse isOpen={this.state.showAbout}>
				<About closePage={this.toggleAbout}/>
			</Collapse>
		);
	}

	renderAtlas() {
		return (
			<Collapse isOpen={!this.state.showAbout}>
				<Atlas createSnackBar={this.props.createSnackBar}/>
			</Collapse>
		);
	}

	toggleAbout() {
		this.setState({showAbout: !this.state.showAbout});
	}

	processConfigResponse(configResponse) {
		if(!isJsonResponseValid(configResponse.body, configSchema)) {
			this.processServerConfigError("Configuration Response Not Valid. Check The Server.");
		} else if(configResponse.statusCode === HTTP_OK) {
			this.processServerConfigSuccess(configResponse.body);
		} else {
			this.processServerConfigError("An Unknown Error Has Occurred. Please Refresh The Page.");
		}
	}

	processServerConfigSuccess(config, port=this.state.serverSettings.serverPort) {
		LOG.info("Switching to server ", this.state.serverSettings.serverPort);
		let updatedSettings = { serverConfig: config, serverPort: port };
		this.setState({serverSettings: updatedSettings});
	}

	processServerConfigError(message) {
		LOG.error(message);
		let updatedSettings = Object.assign(this.state.serverSettings);
		updatedSettings.serverConfig = null;
		this.setState({serverSettings: updatedSettings});
		this.props.createSnackBar(message);
	}
}