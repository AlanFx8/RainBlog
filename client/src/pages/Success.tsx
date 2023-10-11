import React from "react";
import { useLocation } from "react-router-dom";

//THE SUCCESS PAGE
const Success: React.FC = () => {
    const location = useLocation();
    const { type } = location.state;
    return(<div id="success-page" className="panel padded stylized-text">
        {type === "new" && <p>Successfully created new post with the ID: { location.state.id }</p>}
        {type === "edit" && <p>Successfully edited post: { location.state.id }</p>}
        {type === "delete" && <p>Successfully deleted post: { location.state.id }</p>}
    </div>);
}

//EXPORT
export default Success;