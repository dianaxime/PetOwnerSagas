import { v4 as uuidv4 } from 'uuid';
import {
    call,
    takeEvery,
    put,
    // race,
    // all,
    //delay,
    select,
} from 'redux-saga/effects';
  
import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';
  
const API_BASE_URL = 'http://localhost:8000/api/v1/owners/';

function* fetchingPetOwners(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);
  
        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
            fetch,
            `${API_BASE_URL}`,
            {
                method: 'GET',
                //body: JSON.stringify({}),
                headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
                },
            }
            );
            if (response.status === 200) {
                let owners_entities = {};
                let owners_order = [];
                const owners = yield response.json();
                owners.forEach(element => {
                    const owner_id = uuidv4()
                    owners_entities = {...owners_entities, [owner_id]: element}
                    owners_order = [...owners_order, owner_id]
                });
                console.log("Ver todos los owners");
                console.log(owners);
                yield put(actions.completeFetchingPetOwners(owners_entities, owners_order));
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failFetchingPetOwners(non_field_errors[0]));
            }
        }
    } catch (error) {
        yield put(actions.failFetchingPetOwners(error));
        console.log(error);
    }
}
  
function* addingPetOwner(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated);
        if (isAuth) {
            const owner_name  = action.payload;
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}`,
                {
                    method: 'POST',
                    body: JSON.stringify({name: owner_name}),
                    headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                    },
                }
            );
            let id = uuidv4();
            if (response.status === 201) {
                const owner_added = yield response.json();
                console.log("Owner agregado");
                console.log(owner_added);
                yield put(actions.completeAddingPetOwner(id, owner_added));
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failAddingPetOwner(id, non_field_errors[0]));
            }
        }
    } catch (error) {
        //yield put(actions.failAddingPetOwners(id, error));
        console.log(error);
    }
}

function* removingPetOwner(action) {
    const  id_owner = parseInt(action.payload.id);
    try {
        const isAuth = yield select(selectors.isAuthenticated);
        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
            fetch,
            `${API_BASE_URL}${id_owner}`,
            {
                method: 'DELETE',
                //body: JSON.stringify({}),
                headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${token}`,
                },
            }
            );
            if (response.status === 204) {
                console.log("Owner eliminado con ID:");
                console.log(id_owner);
                //const owner_deleted = yield response.json();
                //console.log(owner_deleted);
                yield put(actions.completeRemovingPetOwner());
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failRemovingPetOwner(id_owner, non_field_errors[0]));
            }
        }
    } catch (error) {
        //yield put(actions.failRemovingPetOwners(owner_id, error));
        console.log(error);
    }
}

export function* watchFetchingPetOwners() {
    yield takeEvery(
        types.PET_OWNERS_FETCH_STARTED,
        fetchingPetOwners,
    );    
}

export function* watchAddingPetOwner() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addingPetOwner,
    );    
}
  
export function* watchRemovingPetOwner() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removingPetOwner,
    );    
}
  