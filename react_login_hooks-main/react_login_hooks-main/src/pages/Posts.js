import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from '../components/Carousel';
import { Payment } from '../components/Payment';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [ispaid, setIspaid] = useState(false);

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
            imageUrl0: post.images[0],
            imageUrl1: post.images[1],
            imageUrl2: post.images[2],
            imageUrl3: post.images[3],
            imageUrl4: post.images[4],
            imageUrl5: post.images[5],
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
    <article>
      {posts.length ? (
        <ul>
            {posts.map((post, i) => (
              <li key={i}>
                <div className="list-none mx-auto my-12 flex flex-col sm:flex-row items-center gap-8">
                  <Carousel
                    images={[
                      post.imageUrl0,
                      post.imageUrl1,
                      post.imageUrl2,
                      post.imageUrl3,
                      post.imageUrl4,
                      post.imageUrl5,
                    ]}
                    username={post.username}
                    desc={post.desc}
                  />
                  <button key={`payment-button-${i}`} onClick={() => handlePayment(post)}>
                    <h1>Pay to get seller contact</h1>
                  </button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div>
          <p>No posts to display</p>
        </div>
      )}
        <button onClick={() => handlePaymentpost()} class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          Create Post
        </button>

    </article>
  );
};

export default Posts;