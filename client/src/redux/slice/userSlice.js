import { createSlice } from "@reduxjs/toolkit"

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

const userSlice= createSlice({
    name:'user',
    initialState,
    reducers:{
        signupStart:(state)=>{
            state.loading=true;
            state.error=null;
        },
        signupSuccess:(state,action)=>{
            state.loading=false;
            state.currentUser=action.payload;
            state.error=null;

        },
        signupFail:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }
    }
});

export const {signupStart,signupSuccess,signupFail}=userSlice.actions;

export default userSlice.reducer;