import React from 'react'
import './Breadcrumb.css'

function Breadcrumb({address}) {
    return (
        <div className="breadcrumb">
            <h2>{address}</h2>
        </div>
    )
}

export default Breadcrumb
