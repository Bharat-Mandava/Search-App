import React from "react";
import countriesData from "../data/countriesWithContinents.json";
import { debounce } from 'lodash';
import axios from 'axios';
import '../App.css'
export default class AutoCompleteText extends React.Component {
    constructor(props) {
        super(props);
        this.items = countriesData;
        this.searchStates = debounce(this.searchStates, 1000);
        this.state = {
            suggestions: [],
            text: "",
        };
        this.getCountriuesWithBlank = this.getCountriuesWithBlank.bind(this);
    }
    //Fetch data from cookies
    getCountriuesWithBlank = () => {
        console.log('hello')
    }
    //case 2 : fetch data from server

    getcountries = (e) => this.searchStates(e);

    searchStates = async (e) => {
        let suggestions = [];
        const value = e;
        console.log(e);
        // const res = await fetch(`/countrycode?name=${e}`);
        // const country = await res.json();
        const res = await axios.get(`/countrycode?name=${e}`);
        console.log(res);
        const country = res.data;
        suggestions = country.map(e => e.country_code)
        console.log(suggestions);
        this.setState(() => ({ suggestions, text: value }));
    };


    //select the value from the dropdown
    suggestedSuggestion(value) {
        this.setState(() => ({
            text: value,
            suggestions: [],
        }));
    }

    //render suggestions on the screen
    renderSuggestions() {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <div className='searchbarDiv'>
                <ul className='ulList'>
                    {suggestions.map((item, key) => (
                        <li className='liList'
                            key={key}
                            onClick={() => this.suggestedSuggestion(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    render() {
        const { text } = this.state;
        return (
            <div>
                <input value={text} placeholder="Search.." className='searchBar' type="text" onChange={e => this.getcountries(e.target.value)} onClick={this.getCountriuesWithBlank} />
                {this.renderSuggestions()}
            </div>
        );
    }
}
