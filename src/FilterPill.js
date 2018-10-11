import React from 'react'
import PropTypes from 'prop-types'
 
import './FilterPill.css' 


export default class FilterPill extends React.PureComponent {

    constructor(props) {
        super(props)
        this.clickEdit = this.clickEdit.bind(this)
        this.clickDelete = this.clickDelete.bind(this)
    }

	render(){ 
        const op = this.props.op,
            value = (op==='null'||op==='nn') ? null : <span className="pill-value">{this.props.value}</span>

        return <div id={this.props.id} 
                className={this.props.selected ? 'active-pill' : ''} 
                onClick={this.clickEdit}> 
            <span className="pill-text" >
                <span className="pill-field">{this.props.field}</span>
                <span className="pill-operator">{this.props.operator}</span>
                {value}
            </span>
            <span className="pill-del" id={this.props.id} onClick={this.clickDelete}>×</span>
        </div>
    }

    clickDelete(evt){ 
        const id = parseInt(evt.currentTarget.id, 10)
        evt.stopPropagation();
        this.props.fnDelete(id)
    } 

    clickEdit(evt){ 
        const id = parseInt(evt.currentTarget.id, 10)
        this.props.fnEdit(id)
    }

}

FilterPill.propTypes = {
    fnEdit: PropTypes.func.isRequired,
    fnDelete: PropTypes.func.isRequired,
    selected: PropTypes.bool,

    id: PropTypes.string,
    field: PropTypes.string,
    operator: PropTypes.string,
    value: PropTypes.string,
}