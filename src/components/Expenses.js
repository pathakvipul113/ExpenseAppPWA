import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Draggable, { DraggableCore } from 'react-draggable'
import { createExpense } from '../store/actions/expenseAction'
import { connect } from 'react-redux'
import 'firebase/firestore'
import firebase from 'firebase/app'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'


import "react-datepicker/dist/react-datepicker.css";

var value = new Date().toISOString();

class Expense extends Component {
    state = {
        description: '',
        paidBy: "",
        Amount: '',
        paidTo: '',
        showModal: false,
        showModalSave: false,
        isDisabled: true,
        isPayment: true,
        startDate: new Date(),
        docId: window.location.pathname.slice(7),
        dis: 'block',
        selectedRadio: 0,
        items: [],
        date2: ''
    }

    handleStart = () => {
        console.log('here');
    }

    handleRadioChange = (event) => {
        console.log("event", this.props.persons[event].nickname)
        this.setState({
            selectedRadio: event,
            paidBy: this.props.persons[event].nickname
        })
    };

    onToggle(e) {
        console.log(this.props.persons)

        const items = this.state.items
        let index


        if (e.target.checked) {

            items.push(this.props.persons[e.target.value].nickname)
        } else {

            index = items.indexOf(+e.target.value)
            items.splice(index, 1)
        }
        this.setState({ items: items })
        console.log(this.state.items)

    }

    changeDate(date) {
        this.setState({
            startDate: date
        });
    }

    handleChange = (e) => {
        console.log(e.target.id)
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    Sclose() {
        this.setState({ showModalSave: false });
    }

    saveOpen() {
        this.setState({ showModalSave: true });
    }

    save(e) {
        e.preventDefault();
        this.props.createExpense({
            docId: this.state.docId,
            description: this.state.description,
            date: moment(this.state.startDate).calendar(),
            amount: this.state.Amount,
            paidBy: this.state.paidBy !== "" ? this.state.paidBy : this.props.persons[0].nickname,
            items: this.state.items,


        });
        this.setState({
            showModal: false,
            description: '',
            date: new Date(),
            Amount: '',
            paidBy: '',
            items: [],
            selectedRadio: 0,
        })
    }

    saveAndNew(e) {
        e.preventDefault();
        this.props.createExpense({
            docId: this.state.docId,
            description: this.state.description,
            date: moment(this.state.startDate).calendar(),
            amount: this.state.Amount,
            paidBy: this.state.paidBy !== "" ? this.state.paidBy : this.props.persons[0].nickname,
            items: this.state.items !== "" ? this.state.items : this.props.persons[0].nickname,

        });
        this.setState({
            showModal: true,
            description: '',
            date: new Date(),
            Amount: '',
            paidBy: '',
            items: [],
            selectedRadio: 0,
        })

    }


    editMode(index, event) {
        console.log('item index = ', index)
        var data = this.props.field[index][1]
        var data1 = this.props.field[index][0]
        console.log(this.props.field[index][0])

        this.setState({
            showModalSave: true,
            Amount: data.amount,
            startDate: new Date(),
            description: data.description,
            items: data.items,
            paidBy: data.paidBy,
            date2: data1
        });
    }

    saveClose(e) {

        this.setState({
            showModalSave: false,
            description: '',
            date: new Date(),
            Amount: '',
            paidBy: '',
            items: [],
            selectedRadio: 0,

        });
        const db = firebase.firestore();
        db.collection('sheets').doc(this.state.docId)
            .update({
                ['expense ' + this.state.date2]: {
                    description: this.state.description,
                    date: moment(this.state.startDate).calendar(),
                    amount: this.state.Amount,
                    paidBy: this.state.paidBy,
                    items: this.state.items
                }
            }
            )
    }



    render() {
        console.log(this.state.data2)
        const { sheet, persons, field } = this.props;
        console.log(sheet)
        console.log(field)
        return (
            <div>
                <table border="1">
                    <thead>
                        <tr className="rowContent">
                            <th><center>Action</center></th>
                            <th><center>Date</center></th>
                            <th><center>Description</center></th>
                            <th><center>Who Paid?</center></th>
                            <th><center>Amount</center></th>
                            <th><center>For Whom</center></th>
                        </tr>
                        {field && field.map((item, id) => {
                            console.log(item)
                            return (
                                <tr key={item.id}>
                                    <td>
                                        {/* <td><button onClick={this.deleteSelected.bind(this, id)}>Delete</button> */}
                                        <button onClick={this.editMode.bind(this, id)}>Edit</button></td>
                                    <td><center className="dateexp">{item[1].date}</center></td>
                                    <td><center>{item[1].description}</center></td>
                                    <td><center>{item[1].paidBy}</center></td>
                                    <td><center>{item[1].amount}</center></td>
                                    <td><center>{item[1].items && item[1].items.map((name) => {
                                        return (
                                            <span style={{ 'padding-right': '5px' }}>{name}</span>
                                        )
                                    })}</center></td>
                                </tr>
                            )
                        })}
                    </thead>
                </table>
                <div style={{ 'margin-top': '15px' }}>>><b>Click On Add Expense to enter the expense. Once done, click Compute Payments.</b></div>
                <div>
                    <Button
                        bsStyle="primary"
                        bsSize="large"
                        onClick={this.props.open.bind(this)}
                        className="perEx"
                    >
                        Add Expense</Button>
                    <Button
                        bsStyle="primary"
                        bsSize="large" disabled={this.state.isPayment} className="perEx">Compute Payments</Button>
                </div>

                <div>

                    <Modal show={this.state.showModal} onHide={this.props.close.bind(this)} className="handle" >
                        <Modal.Header closeButton className="modalheader">
                            <Modal.Title>New Expense</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div><span className="date">Date </span><DatePicker
                                selected={this.state.startDate}
                                onChange={this.changeDate.bind(this)}
                                className="datePanel"
                                id="date"
                                value={this.state.startDate}
                            /></div>
                            <div><span className="expdesc">Description</span> <input type="text" id="description" value={this.state.description} onChange={this.handleChange.bind(this)} className="inputDesc"></input></div>
                            <div className="divPaid"><span className="paid">Who Paid?</span>

                                {this.props.persons && this.props.persons.map((item, id) => {
                                    return (
                                        <span className="paidradio">
                                            <input type="radio"
                                                name="radioButtonSet"
                                                id={id}
                                                value={id}
                                                checked={this.state.selectedRadio === id}
                                                onChange={this.handleRadioChange.bind(this, id)} /> {item.nickname}
                                        </span>
                                    )
                                })}

                            </div>
                            <div><span className="expamount">Amount</span> <input type="text" style={{ 'margin-top': '9px' }} id="Amount" value={this.state.Amount} onChange={this.handleChange.bind(this)}></input></div>
                            <div className="divPaid"><span className="expWho">For Whom?</span>
                                {this.props.persons && this.props.persons.map((item, id) => {
                                    return (
                                        <span className="paidradio">
                                            <input type="checkbox" value={id} onChange={this.onToggle.bind(this)} /> {item.nickname}
                                        </span>
                                    )
                                })}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.saveAndNew.bind(this)}>Save & New</Button>
                            <Button onClick={this.save.bind(this)}>Save</Button>
                            <Button onClick={this.props.close.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={this.state.showModalSave} onHide={this.Sclose.bind(this)} className="handle" >
                        <Modal.Header closeButton className="modalheader">
                            <Modal.Title>New Expense</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div><span className="date">Date </span><DatePicker
                                selected={this.state.startDate}
                                onChange={this.changeDate.bind(this)}
                                className="datePanel"
                                id="date"
                                value={this.state.startDate}
                            /></div>
                            <div><span className="expdesc">Description</span> <input type="text" id="description" value={this.state.description} onChange={this.handleChange.bind(this)} className="inputDesc"></input></div>
                            <div className="divPaid"><span className="paid">Who Paid?</span>

                                {this.props.persons && this.props.persons.map((item, id) => {
                                    return (
                                        <span className="paidradio">
                                            <input type="radio"
                                                name="radioButtonSet"
                                                id={id}
                                                value={id}
                                                checked={this.state.selectedRadio === id}
                                                onChange={this.handleRadioChange.bind(this, id)} /> {item.nickname}
                                        </span>
                                    )
                                })}

                            </div>
                            <div><span className="expamount">Amount</span> <input type="text" style={{ 'margin-top': '9px' }} id="Amount" value={this.state.Amount} onChange={this.handleChange.bind(this)}></input></div>
                            <div className="divPaid"><span className="expWho">For Whom?</span>
                                {this.props.persons && this.props.persons.map((item, id) => {
                                    return (
                                        <span className="paidradio">
                                            <input type="checkbox" value={id} onChange={this.onToggle.bind(this)} /> {item.nickname}
                                        </span>
                                    )
                                })}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.saveClose.bind(this)}>Save</Button>
                            <Button onClick={this.Sclose.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                </div>

            </div>
        )

    }
}


const mapStateToProps = (state, ownProps) => {
    console.log(state)
    console.log(ownProps)
    const id = ownProps.person ? ownProps.person.id : "";
    const sheets = state.firestore.ordered.sheets
    if (sheets) {
        var sheet1 = sheets.find(item => item.id === id);
        var result = Object.entries(sheet1).filter(([key]) => key !== 'authorFirstName'
            && key !== 'authorId'
            && key !== 'authorLastName'
            && key !== 'createdAt'
            && key !== 'id'
            && key !== 'sheetName');
    }
    return {
        sheet: sheet1,
        persons: state.firestore.ordered.persons,
        field: result
    }
}

const mapToDispatchProps = (dispatch) => {
    return {
        createExpense: (expense) => dispatch(createExpense(expense))
    }
}

export default compose(
    connect(mapStateToProps, mapToDispatchProps),
    firestoreConnect([{
        collection: 'sheets'
    }, {
        collection: 'persons', orderBy: ['createdAt', 'asc']
    },])

)(Expense);