import React, { Component } from 'react';
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import moment from 'moment'
import { Button, Modal } from 'react-bootstrap';
import { createPerson } from '../store/actions/addPersonAction'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Tab, Tabs } from 'react-bootstrap';

class PersonDetails extends Component {

    state = {
        showModal: false,
        name: '',
        nickname: '',
        comment: '',
        id: '',
        showModalSave: false,
        docId: '',
        isChecked: false,
        deleteDocId: [],
        isDisabled: true,
        key: 'group',
        isExpenseDisabled: true,
        isComputeDisabled: true
    }

    handleSelect(value) {
        this.setState({
            key: value,
        });
    }

    deleteSelected(index, event) {
        alert("Are you sure you want to delete this person");
        var docId = ''
        var data = this.props.persons[index]

        if (this.props.persons && this.props.persons.length <= 2) {
            console.log(this.props.persons.length)
            console.log(this.state.isExpenseDisabled)
            this.setState({
                isExpenseDisabled: true
            });
        }
        const db = firebase.firestore();

        db.collection('persons').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.data())
                var docData = doc.data();
                console.log(docData.name)
                if (docData.name === data.name && docData.nickname === data.nickname) {
                    console.log(doc.id)
                    docId = doc.id
                    this.setState({
                        docId: doc.id
                    })
                    db.collection('persons').doc(docId).delete();

                }
                else {
                    console.log("not found")
                }
            })
        })

    }

    handleChange = (e) => {
        console.log(e.target.id)
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    close() {
        this.setState({ showModal: false });
    }

    saveOpen() {
        this.setState({ showModalSave: true });
    }
    open() {
        this.setState({ showModal: true });
    }

    save(e) {
        e.preventDefault();
        console.log(this.props.persons.length)

        if (this.props.persons && this.props.persons.length >= 1) {
            if (this.state.isExpenseDisabled) {
                this.setState({
                    isExpenseDisabled: false
                });
            }
        }
        this.props.createPerson({ name: this.state.name, nickname: this.state.nickname, comment: this.state.comment });
        this.setState({
            showModal: false, name: '',
            nickname: '',
            comment: '',

        });
    }

    saveAndNew(e) {
        e.preventDefault();
        console.log(this.props)
        if (this.props.persons && this.props.persons.length >= 1) {
            if (this.state.isExpenseDisabled) {
                this.setState({
                    isExpenseDisabled: false
                });
            }
        }
        this.props.createPerson({ name: this.state.name, nickname: this.state.nickname, comment: this.state.comment });
        this.setState({
            name: '',
            nickname: '',
            comment: '',
        })
    }

    editMode(index, event) {
        console.log('item index = ', index);
        console.log(this.props);
        var data = this.props.persons[index]
        console.log(data)
        const db = firebase.firestore();
        console.log(db);

        db.collection('persons').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.data())
                var docData = doc.data();
                console.log(docData.name)
                if (docData.name === data.name && docData.nickname === data.nickname) {
                    console.log(doc.id)
                    this.setState({
                        docId: doc.id
                    })
                }
                else {
                    console.log("not found")
                }
            })
        })
        this.setState({
            showModalSave: true, name: data.name,
            nickname: data.nickname,
            comment: data.comment,
        });
    }

    saveClose(e) {
        console.log(this.state.docId)
        this.setState({ showModalSave: false });
        const db = firebase.firestore();
        db.collection('persons').doc(this.state.docId).update({
            name: this.state.name,
            nickname: this.state.nickname,
            comment: this.state.comment
        })
    }

    tabChange() {
        this.setState({
            key: 'expense'
        })
    }

    render() {
        if (this.props.persons && this.props.persons.length >= 2) {
            console.log("hi", this.props.persons.length)
            if (this.state.isExpenseDisabled) {
                this.setState({
                    isExpenseDisabled: false
                });
            }
        }

        const { person, persons } = this.props;
        return (
            <div>
                <div>Sheet {person ? person.sheetName : ""}</div>
                <div> Created on {person ? moment(person.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') : ""}</div>
                <Tabs activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}>
                    <Tab eventKey="group" title="Create Group" ><table border="1">
                        <thead>
                            <tr>
                                <th><center>Action</center></th>
                                <th><center>Person Name</center></th>
                                <th><center>Display Name</center></th>
                                <th><center>Description or Comment</center></th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                        {persons && persons.map((item, i) => {
                            return (
                                <tr key={item.id}>

                                    <td>
                                        {/* <input type="checkbox" value={this.state.isChecked} onChange={this.handleCheckbox.bind(this, i)} id={item.id} /> */}
                                        <button onClick={this.deleteSelected.bind(this, i)}>Delete</button>
                                        <button onClick={this.editMode.bind(this, i)}>Edit</button>
                                    </td>
                                    <td><center>{item.name}</center></td>
                                    <td><center>{item.nickname}</center></td>
                                    <td><center>{item.comment}</center></td>
                                </tr>
                            )
                        })}
                    </table>

                        <Button
                            bsStyle="primary"
                            bsSize="large"
                            onClick={this.open.bind(this)}
                        >
                            Add Person
        </Button>
                        <button disabled={this.state.isExpenseDisabled} onClick={() => this.handleSelect("expense")}>Enter Expense</button>
                    </Tab>
                    <Tab eventKey="expense" title="Enter Expenses" disabled={this.state.isExpenseDisabled}>Tab 2 content </Tab>
                    <Tab eventKey="payment" title="Compute Payments" disabled={this.state.isComputeDisabled}>Tab 3 content</Tab>
                </Tabs>


                <div>


                    <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Person</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>Person Name: <input type="text" id="name" value={this.state.name} onChange={this.handleChange.bind(this)}></input></div>
                            <div>Display Name: <input type="text" id="nickname" value={this.state.nickname} onChange={this.handleChange.bind(this)}></input></div>
                            <div>Comment/ Description: <input type="text" id="comment" value={this.state.comment} onChange={this.handleChange.bind(this)}></input></div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.saveAndNew.bind(this)}>Save & New</Button>
                            <Button onClick={this.save.bind(this)}>Save</Button>
                            <Button onClick={this.close.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showModalSave} onHide={this.saveClose.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Save Person</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>Person Name: <input type="text" id="name" value={this.state.name} onChange={this.handleChange.bind(this)}></input></div>
                            <div>Display Name: <input type="text" id="nickname" value={this.state.nickname} onChange={this.handleChange.bind(this)}></input></div>
                            <div>Comment/ Description: <input type="text" id="comment" value={this.state.comment} onChange={this.handleChange.bind(this)}></input></div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.saveClose.bind(this)}>Save</Button>
                            <Button onClick={this.saveClose.bind(this)}>Close</Button>
                        </Modal.Footer>
                    </Modal>




                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    console.log(state)
    const id = ownProps.match.params.id;
    const sheets = state.firestore.ordered.sheets
    if (sheets) {
        var player = sheets.find(item => item.id === id);
    }
    return {
        person: player,
        persons: state.firestore.ordered.persons
    }
}

const mapToDispatchProps = (dispatch) => {
    return {
        createPerson: (person) => dispatch(createPerson(person))
    }
}


export default compose(
    connect(mapStateToProps, mapToDispatchProps),
    firestoreConnect([{
        collection: 'sheets', orderBy: ['createdAt', 'desc']
    }, {
        collection: 'persons', orderBy: ['createdAt', 'asc']
    }])

)(PersonDetails);