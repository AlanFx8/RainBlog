import React, { ChangeEvent } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from '../slices/authSlice';
import '../styles/navigation.scss';

//NAVIGATION COMPONENT
const Navigation = React.forwardRef((props: any, ref: any) => {
    //Fields
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);

    //Methods
    const _onSmallNavSelection = (e: ChangeEvent<HTMLSelectElement>) => {
        const nav = e.target;
        if (nav.options[nav.selectedIndex].value === "logout"){
            _onLogout();
            return;
        }

        if (nav.selectedIndex === 0)
            return;
        navigate(`${nav.options[nav.selectedIndex].value}`);
    }

    const _onLogout =async () => {
        try {
            dispatch(logout(null));
            navigate('/');
        }
        catch (err) {
            alert("Sorry, could not Lougout");
        }
    }

    //Render
    return (<nav id="main-nav" ref= { ref } className={ props.isSticky ? "sticky" : "" } >
        {/*THE MAIN NAVBAR*/}
        <ul id="nav-main-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/listposts">Show Posts</Link></li>
            <li><Link to="/newpost">New Post</Link></li>
            { userInfo &&
                <li><a onClick = { _onLogout }>Logout</a></li>
            }
        </ul>

        {/*THE SMALL NAVBAR*/}
        <select name="urlName" id="nav-small-menu" onChange={_onSmallNavSelection}>
            <option value="">-Select-</option>
            <option value="/">About</option>
            <option value="/listposts">Show Posts</option>
            <option value="/newpost">New Post</option>
            { userInfo && 
                <option value="logout">Logout</option>
            }
        </select>
    </nav>);
});

//EXPORT
export default Navigation;