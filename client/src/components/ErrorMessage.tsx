import React from 'react';

interface IErrorMessage {
    message: string,
    callStack: string | null
}

const ErrorMessage: React.FC<IErrorMessage> = ({ message, callStack}: IErrorMessage) => {
    //Log CallStack?
    if (callStack){
        console.log(callStack);
    }
    
    //Render
    return (<div className="error-message">
        <p>Sorry there was an error: <br />
        { message }
        </p>
    </div>);
}

//EXPORT
export default ErrorMessage;