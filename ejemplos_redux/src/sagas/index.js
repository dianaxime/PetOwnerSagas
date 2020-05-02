import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import { watchFetchingPetOwners, watchAddingPetOwner, watchRemovingPetOwner } from './petOwners';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchFetchingPetOwners),
    fork(watchAddingPetOwner),
    fork(watchRemovingPetOwner),
  ]);
}


export default mainSaga;
