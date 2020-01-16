import React, {Component} from 'react';
import './header-footer.css';
import HeaderLogo from './resources/tcoLogo.svg';
import {teamName} from '../Constants';

/* Renders a text heading above the application with useful information.
 */
export default class Header extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="add-header-height">
          <div className="application-width">
            <div id="responsiveHeaderContainer">
              <a href="https://cs.colostate.edu/~cs314" id="csuHeaderLink" target="_blank">
                  <img id="tcoLogo" src={HeaderLogo}
                       height="100%" alt="TCO Brand Logo"/>
              </a>
              <a id="responsiveLogoSubsystem" onClick={this.props.toggleAbout}>
                <h1 className="larger-CSUtext-upper">
                  {teamName}
                </h1>
              </a>
            </div>
          </div>
        </div>
    );
  }

}
