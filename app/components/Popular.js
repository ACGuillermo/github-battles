import React from 'react'
import PropTypes from 'prop-types'
import {fetchPopularRepos} from '../utils/api.js'
import {FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'
import Card from './Card'


function LanguagesNav ({selected, onUpdateLanguage, repos, error}){
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'Python']


    return (
        <ul className='flex-center'>
            {languages.map((language)=>(
                <li key={language}>
                    <button className='btn-clear nav-link'
                    style={language===selected ? {color: 'red'}:null}
                    onClick={()=>onUpdateLanguage(language)}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid ({repos}) {
    return(
        <ul className='grid space-around'>
            {repos.map((repo,i)=>{
                const {name, owner, html_url, stargazers_count, forks, open_issues} = repo
                const {login, avatar_url} = owner

                return (
                    <Card
                        header={`#${i+1}`}
                        avatar={avatar_url}
                        href={html_url}
                        name={login}
                    >
                        <ul className='card-list'>
                            <li>
                                <FaUser color='rgb(255,191,116)' size={22} />
                                <a href={`https://github.com/${login}`}>
                                    {login}
                                </a>
                            </li>
                            <li>
                                <FaStar color='rgb(255, 215, 0)' size={22}/>
                                {stargazers_count.toLocaleString()} stars
                            </li>
                            <li>
                                <FaCodeBranch color='rgb(129, 195, 245)' size={22}/>
                                {forks.toLocaleString()} forks
                            </li>
                            <li>
                                <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                                {open_issues.toLocaleString()} open issues
                            </li>
                        </ul>
                    </Card>
                   
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes ={
    repos: PropTypes.array.isRequired
}




export default class Popular extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            selectedLanguage: 'All',
            repos: {},
            error: null
        }

        {/*Binding functions to THIS*/}
        this.updateLanguage = this.updateLanguage.bind(this)
        this.isLoading = this.isLoading.bind(this)
    }

    componentDidMount(){
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage (selectedLanguage){
        this.setState({
            selectedLanguage,
            error: null
        })
        
        {/*Fetch only when language isnt cached*/}
        if(!this.state.repos[selectedLanguage]){

            fetchPopularRepos(selectedLanguage)
            .then((data)=>{
                this.setState(({repos})=>({
                    repos: {
                        ...repos,
                        [selectedLanguage]: data
                    }
                }))
            })
            .catch(()=>{
                this.setState({
                    error: 'There was an error'
                })
            })
            
        }
    }

    isLoading(){
        const {selectedLanguage, repos, error} = this.state

        return !repos[selectedLanguage] && error === null
    }
    
    render(){
        const {selectedLanguage, repos, error} = this.state

        return (
            <React.Fragment>
                <LanguagesNav
                    selected={selectedLanguage}
                    onUpdateLanguage={this.updateLanguage}
                />
                
                {this.isLoading() && <p>LOADING...</p>}

                {error && <p className="center-text-error">{error}</p>}

                {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]}/>}
            </React.Fragment>
        )
    }
}