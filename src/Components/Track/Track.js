import './Track.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {faPlay} from '@fortawesome/free-solid-svg-icons';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
    }

    renderAction() {
        let button;

        if (!this.props.isRemoval) {
            button = <button className='Track-action' onClick={this.addTrack}>+</button> 
        } else {
            button = <button className='Track-action' onClick={this.removeTrack}>-</button> 
        }
        return button;
    }

    renderPlay() {
        if (this.props.track.preview === null) {
            return null;
        }

        let button = <button className='Track-action' onClick={this.previewTrack}><FontAwesomeIcon icon={faPlay} /></button>
        return button;
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    previewTrack() {
        this.props.onPreview(this.props.track);
    }

    render() {
        return (
            <div className='Track'>
                <div className='Track-information'>
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist}{this.props.track.album}</p>
                </div>
                {this.renderPlay()}
                {this.renderAction()}
            </div>
        )
    }
}