import React, { Component } from 'react';
import {get} from 'axios';

import './ParticipantList.css';
import ParticipantListItem from '../ParticipantListItem';
import config from '../../config.js';

//
// Render the list of participants
//
export default class ParticipantList extends Component {

   state = {
      participants: {},
      isLoading: false,
      fetchError: null
   }
    
   componentDidMount() {
      this.setState({ isLoading: true });
      get(config.serverUrl + '/participants')
         .then(response => this.setState({ participants: response.data, isLoading: false }))
	 .catch(fetchError => this.setState({ fetchError, isLoading: false }));
   }

   render() {
      return (
	 <div className='participant-list'>
            <header className='participant-list-header'>
              <h1 className='participant-list-title'>Select a participant to view details</h1>
            </header>

	    { this.renderList() }
	 </div>
      );
   }

   renderList() {
      const { participants, isLoading, fetchError } = this.state;
      const results = [];

      if (fetchError) {
	 return <p>{ 'ParticipantList: ' + fetchError.message }</p>;
      }

      if (isLoading) {
	 return <p>Loading ...</p>;
      }

      for (let participantId in participants) {
	  results.push(<ParticipantListItem key={participantId} id={participantId} name={participants[participantId]} />);
      }
      return results;
   }
}