import React, { useEffect,  useState, useRef } from 'react';
import Navigation from './Navigation';
import '../styles/header.scss';

const Header: React.FC = () => {
    //States
    const [isSticky, setIsSticky] = useState<boolean>(false);

    //References
    const headerObjectRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    const navBarRef = useRef<HTMLDivElement>(null);

    //Use Effect
    useEffect(() => {
        window.addEventListener("scroll", handleOnScroll);

        return () => {
            window.removeEventListener("scroll", handleOnScroll);
          };
    }, []);

    ///METHODS
    const handleOnScroll = () => {
        //Check if Nav Bar should be sticky
        if (headerObjectRef.current !== null){
            const head = headerObjectRef.current;
            if (window.pageYOffset >= head.offsetTop + head.clientHeight){                
                if (!isSticky){
                    if (navBarRef.current !== null){
                        head.style.marginBottom = navBarRef.current.clientHeight+"px";
                    }
                    setIsSticky(true);
                }
            }
            else {
                head.style.marginBottom = "0";
                setIsSticky(false);
            }
        }

        //Paralax scroll the header
        if (titleTextRef.current !== null) {
            const scrollAmount = window.pageYOffset;
            titleTextRef.current.style.transform = `translate(0, ${scrollAmount * .5}%`;
        }
    }

    //RENDER
    return (<header id="main-header">
        <div id="main-title" ref={ headerObjectRef }>
            <h1 id="main-title-text" ref={ titleTextRef }> Rainblog Site</h1>
        </div>
        <Navigation ref= { navBarRef } isSticky = { isSticky } />
    </header>);
}

//EXPORT
export default Header;