import React from 'react'
import PropTypes from 'prop-types';

import i18n from './i18n' 
import FilterPill from './FilterPill'
import {evoAPI, api2i18n, dateString} from './FilterUtils' 

import './Filter.css' 

var fieldTypes={
    text:'text',
    bool:'boolean',
    number:'number',
    date:'date',
    time:'time',
    list:'list', 
}

const opt = (value, label)=> <option value={value} key={value}>{label}</option>

function lovHash(lov){
    let h = {}
    lov.forEach(l => {h[l.id]=l.text})
    return h
}
function fieldsHash(fields){
    let h = {}
    fields.forEach(f => {h[f.id]=f})
    return h
}

export default class Filter extends React.Component {

    constructor(props) {
        super(props)
        this.hashLovs = {}
        this.hashLovConds = {}
        this.state = {
            conditions: [],
            field: null,
            operator: null,
            value: null,
            showCondition: false,
            conditionIdx: -1,
        }
        this.showCondition = this.showCondition.bind(this);
        this.operatorChange = this.operatorChange.bind(this); 
        this.fieldChange = this.fieldChange.bind(this); 
        this.valueChange = this.valueChange.bind(this); 
        this.ok = this.ok.bind(this); 
        this.cancel = this.cancel.bind(this);
        this.editPill = this.editPill.bind(this); 
        this.deletePill = this.deletePill.bind(this); 
    }

    render(){
        //const entity = this.props.match.params.entity, 
        //    {fields, fieldsH} = models[entity]
            
        this.fields = this.props.fields
        this.fieldsH = fieldsHash(this.props.fields)

        return (
            <div className="evo-filter">
                <div className="fltr-pills">
                    {this.state.conditions ? 
                        this.state.conditions.map((c, idx) => <FilterPill 
                            {...this.pillValue(c)}
                            key={c.field+idx} 
                            id={''+idx} 
                            selected={idx===this.state.conditionIdx}
                            fnEdit={this.editPill}
                            fnDelete={this.deletePill} />)
                        : null}
                </div>
        	<div className="fltr-cond">
                {this.state.showCondition ? ( 
                    <div className="cond evol-fld"> 
                        <div className="cond-field">
                            <div className="evo-rdonly">
                                <select onChange={this.fieldChange} value={this.state.field || ''} className="form-control">
                                    <option value=""  />
                                    {this.fields.map(f => <option value={f.id} key={f.id}>{f.label}</option>)}
                                </select>
                            </div>
                        </div>
                        {this.state.field ? (
                            <div className="cond-operator">
                                <div className="evo-rdonly">{this.renderOperator()}</div>                
                            </div>
                        ) : null}
                        {this.state.operator ? (
                            <div className="cond-value">
                                <div className="evo-rdonly">{this.renderValue()}</div>
                            </div>
                        ) : null}
                        <br/>
                        <div className="cond-buttons">
                            <button onClick={this.cancel} key="cancel" className="btn btn-default"> {i18n.bCancel} </button>
                            {this.conditionIsValid() ? 
                                <button onClick={this.ok} key="ok" className="btn btn-primary"> {i18n.bOK} </button>
                                : null}
                        </div>
                        <div className="clearer"/>
                    </div>
                ):(
                    <button onClick={this.showCondition} key="plus" className="btn btn-default"> + </button>
                )}
        	</div>
        </div>)
    }

    renderOperator(){
        const f = this.fieldsH[this.state.field],
            opts = [],
            fType = f.type

        switch (fType){
            case fieldTypes.list:
                opts.push(opt(evoAPI.sInList, i18n.sInList))
                break;
            case fieldTypes.bool: 
                opts.push(opt(evoAPI.sEqual, i18n.sEqual));
                break;
            case fieldTypes.date:
            case fieldTypes.time:
                if (fType===fieldTypes.time){
                    opts.push(opt(evoAPI.sEqual, i18n.sAt),
                        opt(evoAPI.sNotEqual, i18n.sNotAt));
                }else{
                    opts.push(opt(evoAPI.sEqual, i18n.sOn),
                        opt(evoAPI.sNotEqual, i18n.sNotOn));
                }
                opts.push(opt(evoAPI.sGreater, i18n.sAfter),
                    opt(evoAPI.sSmaller, i18n.sBefore),
                    opt(evoAPI.sBetween, i18n.sBetween),
                    opt(evoAPI.sNotBetween, i18n.sNotBetween));
                break;
            case fieldTypes.number:
                opts.push(opt(evoAPI.sEqual, i18n.sNumEqual),
                    opt(evoAPI.sNotEqual, i18n.sNumNotEqual),
                    opt(evoAPI.sGreater, i18n.sGreater),
                    opt(evoAPI.sSmaller, i18n.sSmaller));
                break;
            default:
                opts.push(opt(evoAPI.sEqual, i18n.sEqual),
                    opt(evoAPI.sNotEqual, i18n.sNotEqual),
                    opt(evoAPI.sStart, i18n.sStart),
                    opt(evoAPI.sContain, i18n.sContain),
                    opt(evoAPI.sNotContain, i18n.sNotContain),
                    opt(evoAPI.sFinish, i18n.sFinish));
        }
        opts.push(
            opt(evoAPI.sIsNull, i18n.sIsNull),
            opt(evoAPI.sIsNotNull, i18n.sIsNotNull)
        )
        return <select onChange={this.operatorChange} value={this.state.operator || ''} className="form-control">
                <option/>
                {opts}
            </select>
    }

    renderValue(){
        const f = this.state.field ? this.fieldsH[this.state.field] : null,
            fType = f.type,
            v = this.state.value

        if(this.state.operator==='null' || this.state.operator==='nn'){
            return null
        }
        //<input onChange={this.valueChange} />
        switch (fType){
            case fieldTypes.bool:
                return <span id="value">
                        <label htmlFor="value1">
                            <input id="value1" name="value" type="radio" value="1" checked={v==='1'} onChange={this.valueChange}/>
                            {i18n.yes}
                        </label>&nbsp;
                        <label htmlFor="value0">
                            <input id="value0" name="value" type="radio" value="0" checked={v==='0'} onChange={this.valueChange}/>
                            {i18n.no}
                        </label>&nbsp;
                    </span>
            case fieldTypes.list:
                return <span id="value" className="lov-checkboxes">  
                        {f.list.map((lv) => <span key={lv.id}>
                                <label>
                                    <input type="checkbox" value={lv.id} onChange={this.valueChange} checked={!!this.hashLovConds[lv.id]} />
                                    {lv.text}
                                </label> 
                            </span>)}
                    </span>
            case fieldTypes.date:
                //return <Datepicker id="value" type={fType} onChange={this.valueChange}/>
                //break;
            case fieldTypes.time:
            case fieldTypes.integer:
            case fieldTypes.decimal:
                //var iType=(fType==fieldTypes.date)?'text':fType;
                return <input id="value" type={fType} onChange={this.valueChange} value={v || ''} className="form-control" /> /*
                if(opBetween){
                    h+='<span class="as-Txt">'+i18n.opAnd+' </span>'+
                        '<input id="value2" type="'+iType+'"/>';
                }*/
            default:
                return <input id="value" type="text" onChange={this.valueChange} value={v || ''} className="form-control" />;
        } 
    }

    pillValue(cond){
        const field = this.fieldsH[cond.field]
        return {
            field: field.label,
            operator: this. operatorText(cond.operator, field),
            value: this.valueText(cond.value, field)
        }
    }

    operatorText(op, f){
        //const f = this.props.field
        //if(f.type==='decimal' || f.type==='decimal' || f.type==='decimal') {}
        // dateString(d)
        //const ff = this.props.fieldsHash[f] 
        return i18n[api2i18n[op]] 
    }

    valueText(v, f){
        if(f.type===fieldTypes.list){
            let hlov = this.hashLovs[f.id]
            if(!hlov){
                hlov = this.hashLovs[f.id] = lovHash(f.list)
            }
            return v.map(vi => hlov[vi]).join(', ')
        }else if(f.type===fieldTypes.bool){
            return (v && v!=='0') ? i18n.yes : i18n.no
        }else if(f.type===fieldTypes.date){
            return dateString(v)
        }
        return v
    }

    showCondition(f){ 
        this.setState({
            showCondition: ! this.state.showCondition
        }) 
    }

    conditionIsValid(){
        const s = this.state

        if(s.field && s.operator){
            if(s.operator==='null' || s.operator==='nn'){
                return true
            }else{
                return !!s.value
            }
        }
    }

    deletePill(idx){
        const cs = this.state.conditions,
            cIdx = this.state.conditionIdx
        let condIdx = -1

        if(idx>-1 && cs.length){
            cs.splice(idx, 1)
            if(idx<cIdx){
                condIdx = this.state.conditionIdx -1
            }else if(idx>cIdx){
                condIdx = this.state.conditionIdx
            }
            this.setState({
                conditions: cs,
                conditionIdx: condIdx,
            })
        } 
    }

    editPill(idx){
        const s = this.state,
            cs = s.conditions,
            c = cs[idx],
            fid = c.field,
            fType = this.fieldsH[fid].type

        if(fType===fieldTypes.list){
            const hlov = this.hashLovs[fid]
            this.hashLovConds = {}
            c.value.forEach(v => {
                this.hashLovConds[v] = hlov[v]
            })
        }
        if(idx>-1 && cs.length){
            this.setState({
                field: fid,
                operator: c.operator,
                value: c.value,
                showCondition: true,
                conditionIdx: idx,
            })
        } 
    }

    fieldChange(evt){
        this.setState({
            field: evt.currentTarget.value,
            operator: null,
        })
    }

    operatorChange(evt){
        const op=evt.currentTarget.value

        this.hashLovConds={} 
        this.setState({
            operator: op,
            value: (op==='null' || op==='nn') ? null : this.state.value
        })
    }

    valueChange(evt){
        const f = this.fieldsH[this.state.field],
            target=evt.currentTarget
        let value=target.value

        if(f.type===fieldTypes.list){ 
            if(target.checked){
                this.hashLovConds[value] = target.parentElement.textContent
            }else{
                delete this.hashLovConds[value]
            }
            value = Object.keys(this.hashLovConds)
        } 
        this.setState({
            value: value
        }) 
    }

    cancel(evt){
        this.hashLovConds = {}
        this.setState({
            field: null,
            operator: null,
            value: null,
            showCondition: false,
            conditionIdx: -1,
        })
    }

    ok(evt){ 
        let cs = this.state.conditions
        const op = this.state.operator,
            cIdx = this.state.conditionIdx,
            c = {
                field: this.state.field,
                operator: op,
                value: (op==='null' || op==='nn') ? null : this.state.value,
            }

        if(cIdx>-1){
            cs[cIdx] = c
        }else{
            cs = cs.concat([c])
        }
        this.hashLovConds = {}
        this.setState({
            field: null,
            operator: null,
            value: null,
            conditions: cs,
            showCondition: false,
            conditionIdx: -1,
        })
    }

}
  
Filter.propTypes = {
    fields: PropTypes.array.isRequired,
}