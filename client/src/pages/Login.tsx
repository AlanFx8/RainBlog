import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../hooks";
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import '../styles/login.scss';

//===THE LOGIN PAGE===//
//We use Redux instead of Axios
//so we can save the user to the global state
const Login: React.FC = () => {
    //Navigate and Dispatch
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    //State Data
    const [login]= useLoginMutation();
    const { userInfo } = useAppSelector((state) => state.auth);

    //States
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [validating, setValidating] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    //Use Effect
    useEffect(() => {
        if (userInfo){
            navigate('/newpost');
        }
    }, [navigate, userInfo]);

    //Methods
    const UpdateUsername = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value as string);
    }

    const UpdatePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value as string);
    }

    const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidating(true);

        try {
            const res = await login({ username, password}).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/newpost');
        }
        catch (err: any){
            setErrorMessage(err?.data?.message || 'Invalid username or password');
            setValidating(false);
            setShowError(true);
        }
    }

    //Render
    return (
        <form
            id="login-form"
            name="login-form"
            className='panel'
            encType="multipart/form-data"
            onSubmit={OnSubmit}
        >
            <h1 className='post-title'>LOGIN</h1>
            { showError && <div className='error'>
                { errorMessage }  
            </div>}

            <p className='padded-text'>Username: admin123 - Password: password123</p>

            <section className='form-field'>
                <label htmlFor="username">Username</label>
                <input
                    type='text'
                    required
                    name='username'
                    id='username'
                    value={ username }
                    onChange={ UpdateUsername }
                />
            </section>

            <section className='form-field'>
                <label htmlFor="password">Password</label>
                <input
                    type='password'
                    required
                    name='password'
                    id='password'
                    value={ password }
                    onChange={ UpdatePassword }
                />
            </section>

            {/*The Submit Btton*/}
            <section id="submit-post-section">
                <button type="submit" id="submit-button" disabled= { validating }>
                    LOGIN
                </button>
            </section>
        </form>
    );
}

export default Login;