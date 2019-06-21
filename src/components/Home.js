import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSheet } from '.././store/actions/sheetAction'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

class Home extends Component {

    state = {
        sheetName: ''
    }

    handleChange = (e) => {
        console.log(e.target.id)
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.props)
        this.props.createSheet(this.state);
        const id = this.props.sheet
        console.log(id)
        this.props.history.push('/' + 'sheet/' + id)
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <label htmlFor="sheetName">Sheet Name</label>
                <input type="text" id="sheetName" value={this.state.sheetName} onChange={this.handleChange.bind(this)} required />
                <div>
                    <button onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    const sheets = state.firestore.ordered.sheets
    const sheet = sheets ? sheets[0].id : "null"
    // const sheet = sheets ? sheets[id] : null
    return {
        sheet: sheet,
        sheetSuccess: state.sheet.sheetSuccess,
        sheetError: state.sheet.sheetError
    }
}

const mapToDispatchProps = (dispatch) => {
    return {
        createSheet: (sheet) => dispatch(createSheet(sheet))
    }
}


export default compose(
    connect(mapStateToProps, mapToDispatchProps),
    firestoreConnect([{
        collection: 'sheets', orderBy: ['createdAt', 'desc']
    }])

)(Home);