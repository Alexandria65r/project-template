import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import *as Types from '../../src/reusable/interfaces'
import { StudentInquiry } from '../../src/reusable/schemas'

type InquiryState = {
    inquiry: Types.StudentInquiry
    isErr: boolean

}
const initialState: InquiryState = {
    inquiry: StudentInquiry,
    isErr: false
}

const inquirySlice = createSlice({
    name: 'inquirySlice',
    initialState,
    reducers: {
        setInquiry: (state, { payload }: PayloadAction<Types.StudentInquiry>) => {
            state.inquiry = payload
        },
        setInquiryProps: (state, { payload }: PayloadAction<{ name: string, value: any }>) => {
            state.inquiry = { ...state.inquiry, [payload.name]: payload.value }
        },
        setError: (state, { payload }: PayloadAction<boolean>) => {
            state.isErr = payload
        }
    }
})



export const inquiryActions = inquirySlice.actions
export default inquirySlice.reducer