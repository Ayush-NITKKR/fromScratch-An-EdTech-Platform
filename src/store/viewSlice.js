import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    courseSectionData :[],
    courseEntireData :[],
    courseLectures :[],
    courseNoOfLeactures :[],
}

const viewCourseSlice = createSlice({
    name:"viewCourse",
    initialState,
    reducers:{
        courseSectionData:(state , action)=>{
            state.courseSectionData = action.payload
        },
        courseEntireData: (state , action)=>{
            state.courseEntireData = action.payload
        },
        courseLectures: (state , action)=>{
            state.courseLectures = action.payload
        },
        courseNoOfLeactures: (state , action)=>{
            state.courseNoOfLeactures = action.payload
        }
    }
})

export const {
    courseEntireData,
    courseLectures,
    courseNoOfLeactures,
    courseSectionData
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;