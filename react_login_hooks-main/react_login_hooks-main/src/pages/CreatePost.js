import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import {  useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { Payment } from '../components/Payment';

const CreatePost = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    desc: '',
    email: '',
    phone: '',
    idnumber: '',
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


  // const handlePayment = (formData) => {
  //   // Programmatically navigate to Payment component with props
  //   navigate('/posts/paymentpost', {
  //     state: {
  //       email: formData.email,
  //       phone: formData.phone,
  //       username: formData.username,
  //     },
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone); // Fixed name
      formDataToSend.append('idnumber', formData.idnumber); // Fixed name
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await axios.post(
        'http://localhost:3500/posts',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        console.log('Post created successfully:', response.data);
        setFormData({
          username: '',
          desc: '',
          email: '',
          phone: '',
          idnumber: '',
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
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="post"
      >
        <div className="form-group">
          <label>
            Username:
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              type="text"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Description"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Drake Email:
            <textarea
              type="text"
              className="form-control"
              placeholder="Drake Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Drake Id:
            <input
              type="text"
              className="form-control"
              placeholder="Drake Id"
              name="idnumber"
              value={formData.idnumber}
              onChange={handleChange}
              required
            />
          </label>
          <input
            type="file"
            className="form-control-file"
            name="images"
            onChange={handleImageChange}
            multiple
          />
        </div>
        <button >
            Make a Sell Post
        </button>
      </form>
    </>
  );
};

export default CreatePost;
