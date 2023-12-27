import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../store/store";

import PageAPI from "../../src/api-services/page";
import { Page } from "../../src/models/page/page.model";
import router from "next/router";
import { pageActions } from ".";

export const createPageThunk = createAsyncThunk<void, undefined, { state: AppState }>
    ('cartSlice/createPageThunk', async (_, thunkAPI) => {
        const dispatch = thunkAPI.dispatch
        const { AuthReducer: { user: { _id: owner } }, PageReducer: { page } } = thunkAPI.getState()
        const pageId = page.name.replaceAll(' ', '').toLowerCase()

        try {
            const newPagePayload: Page = {
                ...page,
                pageId,
                earnings: {
                    balance: 0,
                    activity: {
                        payouts: [],
                        stars: []
                    }
                },
                author: {
                    id: owner ?? ''
                }
            }
            const newPage = await PageAPI.create(newPagePayload)
            if (newPage) {
                router.replace(`/page/${newPage.pageId}`)
                dispatch(pageActions.setIsFormOpen(false))
            }
        } catch (error) {
            dispatch(pageActions.setPageNetworkStatus(''))
        }
    })


export const fetchPageThunk = createAsyncThunk<void, string, { state: AppState }>
    ('cartSlice/fetchPageThunk', async (pageId, thunkAPI) => {
        const dispatch = thunkAPI.dispatch
        const { AuthReducer: { user: { _id: owner } }, PageReducer: { page } } = thunkAPI.getState()
        try {
            const pageData = await PageAPI.fetchPage(pageId)
            if (pageData) {
                dispatch(pageActions.setPageData(pageData))
            }
        } catch (error) {
            dispatch(pageActions.setPageNetworkStatus(''))
        }
    })
export const fetchPagesThunk = createAsyncThunk<void, undefined, { state: AppState }>
    ('cartSlice/fetchPagesThunk', async (pageId, thunkAPI) => {
        const dispatch = thunkAPI.dispatch
        try {
            const pages = await PageAPI.fetchPages()
            if (pages) {
                dispatch(pageActions.setPages(pages))
            }
        } catch (error) {
            dispatch(pageActions.setPageNetworkStatus(''))
        }
    })


type UpdatePageTargets = 'profile-image' | 'balance' | 'other'
export const updatePageThunk = createAsyncThunk<any, {
    pageId: string, target: UpdatePageTargets, update: any
},
    { state: AppState }>
    ('pageSlice/updatePageThunk', async (params, thunkAPI) => {
        const dispatch = thunkAPI.dispatch
        const { AuthReducer: { user: { _id: owner } }, PageReducer: { page } } = thunkAPI.getState()
        try {
            const { data } = await PageAPI.update(params.pageId, params)
            if (data.success) {
                return { ...data }
            }
        } catch (error) {
            dispatch(pageActions.setPageNetworkStatus(''))
        }
    })