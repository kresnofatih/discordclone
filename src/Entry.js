import React from 'react'

function Entry({login}) {
    return (
        <div>
            <button
                onClick={()=>{
                    login();
                }}
            >login</button>
        </div>
    )
}

export default Entry
