import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserAvatar from '../components/UserAvatar'
import { createArticle } from '../features/article/articleSlice'
import '../styles/home.css'

const NewPost = () => {

    const [show, setShow] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [form, setForm] = useState(new FormData())
    const [img, setImg] = useState('')

    const { user, token } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()

        let content = form.content

        content = content.replace(/ /g, " ")
        content = content.replace(/\n/g, "\n")

        form.userId = user._id
        form.time = Date.now()

        form.content = content
        console.log(form)
        dispatch(createArticle({ article: form, token }))
        setShow(false)

    }


    const fileChangeHandler = (e) => {
        setLoaded(true)
        const img = document.getElementById('img')
        setForm({
            ...form,
            [e.target.name]: e.target.files[0]
        })
        setImg(URL.createObjectURL(e.target.files[0]))
        img.src = URL.createObjectURL(e.target.files[0])
    }

    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="new-post">
            <div className="create-post-container">
                <div className="create-post-header">
                    <UserAvatar />
                    <div className="create-post-button" onClick={() => setShow(!show)}>
                        Start a post
                    </div>
                </div>

                {show && <div className="create-post-body">
                    <h3>create new post</h3>
                    <form className="create-post-form" onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                className='input'
                                type="text"
                                name="title"
                                id="title"
                                onChange={changeHandler}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea name="content" className='textarea' id="content" onChange={changeHandler}>

                            </textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image" className="image">Choose image</label>
                            <input
                                type="file"
                                className='file'
                                name="image"
                                id="image"
                                onChange={fileChangeHandler}
                            />
                            <div style={!loaded ? { display: 'none' } : { display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                <img src={img} alt="img" id="img" width="100%" style={{ borderRadius: '8px' }} />
                            </div>
                        </div>

                        <div>
                            <button>
                                Post
                            </button>
                        </div>
                    </form>
                </div>}
            </div>
        </div>
    )
}

export default NewPost