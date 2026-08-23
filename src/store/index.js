import { combineReducers } from "redux";
import authReducer from './authSlice'
import profileReducer from './profileSlice'
import cartReducer from './cartSlice'
import courseReducer from './courseSlice'
import viewReducer from './viewSlice'
const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewReducer,
})

export default rootReducer;