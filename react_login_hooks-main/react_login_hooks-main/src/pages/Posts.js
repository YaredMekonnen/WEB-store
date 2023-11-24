import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from '../components/Carousel';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPosts = async () => {
      try {
        const response = await axiosPrivate.get('/posts');
        console.log('Response:', response);
        if (Array.isArray(response.data)) {
          const postDetails = response.data.map((post) => ({
            username: post.username,
            desc: post.desc,
            email: post.email,
            phone: post.phone,
            idnumber: post.idnumber,
            images: post.images.map((image, i) => ({
              [`imageUrl${i}`]: image,
            })),
          }));

          console.log('Post Details:', postDetails);
          isMounted && setPosts(postDetails);
        } else {
          console.error('Error: response.data is not an array');
        }
      } catch (err) {
        console.error('Error:', err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate, location, axiosPrivate]);

  const handlePaymentpost = () => {
    // Programmatically navigate to Payment component with props
    navigate('/posts/paymentpost');
  };

  const handlePayment = (post) => {
    // Programmatically navigate to Payment component with props
    navigate('/posts/payment', {
      state: {
        email: post.email,
        phone: post.phone,
        username: post.username,
      },
    });
  };

  return (
    <div id='outerdiv' className='ml-1.4 flex flex-wrap'>
      <button
        onClick={() => handlePaymentpost()}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ml-6"
      >
        Create Post
      </button>
      {posts.length ? (
        <ul className="flex flex-wrap">
          {posts.map((post, i) => (
            <li key={i} className="flex-shrink-0 w-full ">
              <div style={{ width: '90%' }} className="text-white bg-white-800 hover:bg-white-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm mx-2 my-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                <Carousel
                  images={post.images.map((image) => Object.values(image)[0])}
                  username={post.username}
                  desc={post.desc}
                />

                <p className="text-white-400 bg-[#282726] focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 overflow-hidden mt-2">
                  {post.desc}
                </p>
                <button className="text-gray-900 bg-[#ffb521] focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 overflow-hidden mt-2" key={`payment-button-${i}`} onClick={() => handlePayment(post)}>
                  <h1>Pay to get seller contact</h1>
                </button>
                <span>seller contacted by{post.views}buyers</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>No posts to display</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
