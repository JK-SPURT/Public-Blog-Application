import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Initial state
const initialState = {
    data: [],
    loading: false,
    error: null,
    sucess: false
}

// Functions

// Get all articles exists
export const getArticles = createAsyncThunk('article/all', async (token) => {
    return await axios.get('/api/article/articles', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then(response => response.data)
        .catch(error => error.message)
})

// Create new article
export const createArticle = createAsyncThunk('article/create', async (data, { rejectWithValue }) => {
    const { article, token } = data
    return await axios.post('/api/article/create', article, {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => rejectWithValue(error.response.data))
})

// update article
export const updateArticle = createAsyncThunk('article/update', async (data, { rejectWithValue }) => {
    const { article, token, id } = data

    return await axios.put(`/api/article/update/${id}`, article, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => rejectWithValue(error.response.data))
})

// Delete article
export const deleteArticle = createAsyncThunk('article/delete', async (data) => {
    const { token, id } = data

    return await axios.delete(`/api/article/delete/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => error.message)
})

// Like article
export const likeArticle = createAsyncThunk('article/like', async (data) => {
    const { body, token, id } = data

    return await axios.put(`/api/article/like/${id}`, { userId: body }, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => error.message)
})

//Unlike article
export const unlikeArticle = createAsyncThunk('article/unlike', async (data) => {
    const { body, token, id } = data

    return await axios.put(`/api/article/unlike/${id}`, { userId: body }, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => error)
})

// Get number of likes
export const numberOfLikes = createAsyncThunk('article/likes', async (data) => {
    const { token, id } = data
    return await axios.get(`/api/article/count/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => error.message)
})


export const saveComment = createAsyncThunk('article/comment', async (data) => {
    const { token, userId, articleId, content } = data

    return axios.post('/api/comment', { content, userId, articleId }, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    }).then((response) => response.data)
        .catch(error => error.response.message)
})

export const deleteComment = createAsyncThunk('article/deleteComment', async (data) => {
    const { token, id, articleId } = data

    return axios.put(`/api/comment/delete/${id}`, { articleId }, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        }
    })
        .then(res => res.data)
        .catch(err => err.message)
})


// Slice
const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        resetState: (state) => {
            state.data = []
            state.loading = false
            state.error = null
            state.sucess = true
        }
    },
    extraReducers: (builder) => {
        // Get articles 
        builder.addCase(getArticles.pending, state => {
            state.loading = true
        })

        builder.addCase(getArticles.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
            state.error = null
            state.sucess = true
        })

        builder.addCase(getArticles.rejected, (state, action) => {
            state.loading = false
            state.data = []
            state.error = action.payload
            state.sucess = false
        })

        // Create article
        builder.addCase(createArticle.pending, state => {
            state.loading = true
        })

        builder.addCase(createArticle.fulfilled, (state, action) => {
            state.loading = false
            state.data.unshift(action.payload)
            state.error = null
            state.sucess = true
        })

        builder.addCase(createArticle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sucess = false
        })

        // Update article
        builder.addCase(updateArticle.pending, state => {
            state.loading = true
        })

        builder.addCase(updateArticle.fulfilled, (state, action) => {
            state.loading = false

            const index = state.data.findIndex(a => a._id === action.payload._id)
            state.data[index] = action.payload

            state.error = null
            state.sucess = true
        })

        builder.addCase(updateArticle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sucess = false
        })

        // Delete article

        builder.addCase(deleteArticle.fulfilled, (state, action) => {
            state.loading = false
            state.data = state.data.filter(a => a._id !== action.payload.id)
            state.sucess = true
        })

        builder.addCase(deleteArticle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sucess = false
        })

        // Like 
        builder.addCase(likeArticle.fulfilled, (state, action) => {
            state.loading = false
            const id = action.payload._id
            state.data.map(e => {
                if (e._id === id) {
                    return e.likes = action.payload.likes
                }

                return e
            })
            state.sucess = true
        })

        builder.addCase(likeArticle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sucess = false
        })

        // unlike

        builder.addCase(unlikeArticle.fulfilled, (state, action) => {
            state.loading = false
            const id = action.payload._id
            state.data.map(e => {
                if (e._id === id) {
                    return e.likes = action.payload.likes
                }

                return e
            })
            state.sucess = true
        })

        builder.addCase(unlikeArticle.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.sucess = false
        })

        // Comment article

        builder.addCase(saveComment.fulfilled, (state, action) => {
            state.loading = false
            state.data.map(a => {
                if (a._id === action.payload._id) {
                    return a.comments = action.payload.comments
                }

                return a
            })
            state.sucess = true
        })

        builder.addCase(saveComment.rejected, (state, action) => {
            state.loading = false
            state.sucess = false
            state.error = action.payload
        })

        // Delete comment

        builder.addCase(deleteComment.fulfilled, (state, action) => {
            state.loading = false
            state.sucess = true

            state.data.map(a => {
                if (a._id === action.payload._id) {
                    return a.comments = action.payload.comments
                }

                return a
            })
        })

        builder.addCase(deleteComment.rejected, (state, action) => {
            state.loading = false
            state.sucess = false
            state.error = action.payload
        })
    }
})

export default articleSlice.reducer
export const { resetState } = articleSlice.actions