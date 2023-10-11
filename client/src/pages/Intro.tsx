import React from 'react';
import DateShower from '../components/DateShower';

const Intro: React.FC = () => {
    //Render
    return (<div className='panel padded stylized-text'>
        <DateShower />
        <p>Welcome to the Rainblog Site. This is a portfolio bloging site by Alan Freeman where you can view and make your own posts. This site comes with infinite scrolling, a scroll button, a image modal, and thumbnail images generated on the backend. You can login to build your own posts that will be validated as well as edit pre-existing posts, but these will not be saved however.</p>

        <p>This site was made with React, Typescript and SCSS and uses express, axios, redux, sharp, image-size, react-router-dom, and react-query among others.</p>
    </div>);
}

//EXPORT
export default Intro;