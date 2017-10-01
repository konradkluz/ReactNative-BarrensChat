import {createStore, applyMiddleware} from 'redux';
import {AsyncStorage} from 'react-native'
import {persistStore, autoRehydrate} from 'redux-persist'
import {composeWithDevTools} from 'remote-redux-devtools';
import ReduxThunk from 'redux-thunk';
import reducers from './state';

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(ReduxThunk), autoRehydrate()));
persistStore(store, {storage: AsyncStorage, whitelist: ['options', 'auth']}, () => {
    console.log('Loading props from local storage completed.')
});

export default store;