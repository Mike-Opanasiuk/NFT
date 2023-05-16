import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import accountSlice from './reducers/account';
import collectionSlice from './reducers/collections';

const store = configureStore({
    reducer: {
        accountSlice,
        collectionSlice
    }
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
