import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './Auth'
import UserReducer from './User'
import PromotionReducer from './Promotion'

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    promotion: PromotionReducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
