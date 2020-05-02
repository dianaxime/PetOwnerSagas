import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import './styles.css';
import * as selectors from '../../reducers';
import * as actions from '../../actions/petOwners';


const petOwners = ({ onClick, isHidden = false, onDelete, onCreate }) => {
    const [id, changeId] = useState('');
    const [name, changeName] = useState('');
    return (
        <Fragment>
            {
                !isHidden && (
                <Fragment>
                    <input
                        type="text"
                        placeholder="Ingresa un ID"
                        value={id}
                        onChange={e => changeId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ingresa un nombre"
                        value={name}
                        onChange={e => changeName(e.target.value)}
                    />
                    <button className='pet-owners-button' onClick={onClick}>
                        {'Owners'}
                    </button>
                    <button className='delete-button' onClick={() => onDelete(id)}>
                        {'Delete'}
                    </button>
                    <button className='create-button' onClick={() => onCreate(name)}>
                        {'Create'}
                    </button>
                </Fragment>
                )
            }   
        </Fragment>
    );
}


export default connect(
  state => ({
    isHidden: !selectors.isAuthenticated(state),
  }),
  dispatch => ({
    onClick() {
      dispatch(actions.startFetchingPetOwners());
    },
    onCreate(name) {
        dispatch(actions.startAddingPetOwner(name));
    },
    onDelete(id) {
        dispatch(actions.startRemovingPetOwner(id));
    },
  })
)(petOwners);