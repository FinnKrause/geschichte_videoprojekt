import React from 'react';
import "./Top.css";
import NavBar from './NavBar/NavBar';
import ContentTop from './ContentTop';
import SecoundPart from '../SecoundPart/SecoundPart';


interface Props {
    isLogin: boolean;
    setLogin: (newval: boolean) => void
    joke: boolean;
}

const Top: React.FC<Props> = (Props): JSX.Element => {
    return (
        <div id="TOP">
            <NavBar isLogin={Props.isLogin} setLogin={Props.setLogin}/>
            <ContentTop/>
            <SecoundPart joke={Props.joke}/>
        </div>
    )
}

export default Top;