import './SearchBar.css';
import React from 'react';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    handleTermChange(e) {
        const term = e.target.value;
        this.search(term);
    }

    search(term) {
        console.log(`searching for ${term}`);
        this.props.onSearch(term);
    }

    render() {
        return (
            <div className='SearchBar'>
                <input placeholder='Enter A Song, Album, or Artist' onChange={this.handleTermChange}/>
                <button className='SearchButton'>SEARCH</button>
            </div>
        )
    }
}