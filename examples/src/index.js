import React from 'react';
import {render} from 'react-dom';
import Filter from '../../src/Filter';

import "./demo.css"

const fields = [
    {id:"lastname", type:"text", label:"Lastname"},
    {id:"firstname", type:"text", label:"Firstname"},
    {id:"active", type:"boolean", label:"Is active"},
    {id:"age", type:"number", label:"Age"},
    {id:"bday", type:"date", label:"Birthday"},
    {id:"category", type:"list", label:"Category",
        list:[
            {id:"1", text:"Family"},
            {id:"2", text:"Friends"},
            {id:"3", text:"Business"},
            {id:"4", text:"Acquaintances"},
            {id:"5", text:"Other"}
        ]
    }
];

const App = () => (
    <Filter fields={fields} />
);

render(<App />, document.getElementById("root"));