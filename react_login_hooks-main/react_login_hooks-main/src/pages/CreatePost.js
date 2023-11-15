import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const CreatePost = () => {
    const { auth } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        desc: '',
    });
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        setImages(selectedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('desc', formData.desc);

            images.forEach((image, index) => {
                formDataToSend.append('image', image);
            });

            const response = await axios.post('http://localhost:3500/posts', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            if (response.status === 201) {
                console.log('Post created successfully:', response.data);
                setFormData({
                    username: '',
                    desc: '',
                });
                setImages([]);
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} encType="multipart/form-data" method="post">
                <div className="form-group">
                    <label>
                        username:
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        desc:
                        <textarea
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <input type="file" className="form-control-file" name="images" onChange={handleImageChange} multiple />
                </div>
                <button type="submit">Create Post</button>
            </form>
        </>
    );
};

export default CreatePost;
