import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import './PageHeader.css';
import config from '../../config.js';

//
// Render the page header of ParticipantDetail page
//    if there is a 'logos' query parameter, its comma-separated
//    elements will be used as left-to-right logo css classes.
//
export default class PageHeader extends Component {

   static propTypes = {
      rawQueryString: PropTypes.string.isRequired,
      modalIsOpen: PropTypes.bool.isRequired,
      modalFn: PropTypes.func.isRequired	// Callback to handle clicks on header icons
   }

   state = {
      modalName: '',
      logoClasses: ['logo-s4s-button'],		// Default value. Parsed from query string 'logos=a,b,c'
      currentTextSize: 1.0,
      inactiveLight: true
   }

   componentDidMount() {
      const queryVals = queryString.parse(this.props.rawQueryString);
      if (queryVals.logos) {
	  this.setState({logoClasses: queryVals.logos.split(',')});
      }
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.modalIsOpen && !this.props.modalIsOpen) {
	 // The modal was closed -- turn "off" the associated button
	 switch (this.state.modalName) {
	    case 'logoModal':
	       for (var logoClass of this.state.logoClasses) {
		  document.querySelector('.'+logoClass+'-on').className = logoClass+'-off';
	       }
	       break;
	    case 'participantInfoModal':
	       document.querySelector('.participant-info-button-on').className = 'participant-info-button-off';
	       break;
	    case 'helpModal':
	       document.querySelector('.help-button-on').className = 'help-button-off';
	       break;
	    case 'downloadModal':
	       document.querySelector('.download-button-on').className = 'download-button-off';
	       break;
	    case 'printModal':
	       document.querySelector('.print-button-on').className = 'print-button-off';
	       break;
	    default:
	       alert('name=' + this.state.modalName);
	       break;
	 }
	 this.setState({modalName: ''})
      }
   }

   resizeText(dir) {
      if (document.documentElement.style.fontSize === '') {
         document.documentElement.style.fontSize = '1.0rem';
      }

      let size = parseFloat(document.documentElement.style.fontSize);

      if (dir==='+' && size < config.maxTextSize) {
	 size = size + config.textSizeStep;
	 this.setState({currentTextSize: size});
	 document.documentElement.style.fontSize = size + 'rem';

      } else if (dir==='-' && size > config.minTextSize) {
	 size = size - config.textSizeStep;
	 this.setState({currentTextSize: size});
	 document.documentElement.style.fontSize = size + 'rem';
      }
   }

   resetTextSize() {
      this.setState({currentTextSize: 1.0});
      document.documentElement.style.fontSize = '1.0rem';
   }

   buttonClick(buttonName) {
      if (!this.props.modalIsOpen) {
	 this.setState({modalName: buttonName});	// Record which button was clicked for subsequent close
	 this.props.modalFn(buttonName);		// Let parent know to open the modal

	 // Turn "on" the appropriate button
	 switch (buttonName) {
	    case 'logoModal':
	       for (var logoClass of this.state.logoClasses) {
		  document.querySelector('.'+logoClass+'-off').className = logoClass+'-on';
	       }
	       break;
	    case 'participantInfoModal':
	       document.querySelector('.participant-info-button-off').className = 'participant-info-button-on';
	       break;
	    case 'helpModal':
	       document.querySelector('.help-button-off').className = 'help-button-on';
	       break;
	    case 'downloadModal':
	       document.querySelector('.download-button-off').className = 'download-button-on';
	       break;
	    case 'printModal':
	       document.querySelector('.print-button-off').className = 'print-button-on';
	       break;
	    default:
	       break;
	 }
      }
   }

   render() {
      return (
	 <div className='page-header'>
	    <div className='logo-box'>
	       { this.state.logoClasses.map(
		   (logoClass,index) => <button className={logoClass+'-off'} key={logoClass+index} onClick={() => this.buttonClick('logoModal')} /> )}
	    </div>
	    <div className='header-controls-box'>
	      {/* make highlight active/inactive first <button className={'inactive-light-'+(this.state.inactiveLight ? 'on' : 'off')}>Inactive</button> */}
	       <button className='text-size-smaller-button-off'	onClick={() => this.resizeText('-')} />
	       <button className='text-size-larger-button-off'	onClick={() => this.resizeText('+')} />
	       <div className='text-size-current'		onClick={() => this.resetTextSize()}>
	         {Math.round(this.state.currentTextSize*100)}%
	       </div>

	       <button className='participant-info-button-off'	onClick={() => this.buttonClick('participantInfoModal')} />
	       <button className='help-button-off'		onClick={() => this.buttonClick('helpModal')} />
	       <button className='download-button-off'		onClick={() => this.buttonClick('downloadModal')} />
	       <button className='print-button-off'		onClick={() => this.buttonClick('printModal')} />
	    </div>
	 </div>
      )
   }
}
