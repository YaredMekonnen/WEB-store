import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Posts = () => {
    const [posts, setPosts] = useState([]); // Initialize as an empty array
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getPosts = async () => {
            try {
                const response = await axiosPrivate.get('/posts');
                const postDetails = response.data.map(post => ({
                    username: post.username,
                    desc: post.desc,
                    // image: post.image,
                    imageUrl: post.imageUrl,
                    imageUrl1: post.imageUrl1,
                    imageUrl2: post.imageUrl2,
                    imageUrl3: post.imageUrl3,
                    imageUrl4: post.imageUrl4,
                    imageUrl5: post.imageUrl5, // Assuming image data is available in the API response
                }));
                // postDetails.forEach(post => {
                //     const blob = new Blob([new Uint8Array(post.image)], { type: 'image/jpeg' });
                //     post.imageUrl = URL.createObjectURL(blob);
                // });
                // console.log(response.data);
                console.log(postDetails);
                isMounted && setPosts(postDetails);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        

        getPosts();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            <h2>Post List</h2>
            {posts.length
                ? (
                    <ul>
                        {posts.map((post, i) => (
                            <li key={i}>
                                <div>
                                    <img
                                        src={post.imageUrl}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                                                        <img
                                        src={post.imageUrl1}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                                                        <img
                                        src={post.imageUrl2}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                                                        <img
                                        src={post.imageUrl3}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                                                        <img
                                        src={post.imageUrl4}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                                                        <img
                                        src={post.imageUrl5}
                                        //alt={`${post.username} ${post.desc}`}
                                        style={{ width: '150px', height: '150px', }}
                                    />
                                </div>
                                <div>{post.username} {post.desc}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>No posts to display</p>
                        <Link to="/posts/createposts">Create Post</Link>
                    </div>
                )
            }
            <Link to="/posts/createposts"><h1>CreatePost</h1></Link>
        </article>
    );
};

export default Posts;
