import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Carousel } from "../components/Carousel";

const Posts= ()=> {
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
                console.log("Response:", response);
                if (Array.isArray(response.data)) {
                const postDetails = response.data.map(post => ({
                    username: post.username,
                    desc: post.desc,
                    email: post.email,
                    imageUrl0: post.images[0],
                    imageUrl1: post.images[1],
                    imageUrl2: post.images[2],
                    imageUrl3: post.images[3],
                    imageUrl4: post.images[4],
                    imageUrl5: post.images[5],
                }));
        
                console.log("Post Details:", postDetails);
                isMounted && setPosts(postDetails);
            }else {
                console.error('Error: response.data is not an array');
            }
            } catch (err) {
                console.error("Error:", err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };
        
        

        getPosts();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <article>
            {posts.length ? (
                <ul>
                    {posts.map((post, i) => (
                        <li key={i}>
                          <Carousel images={[post.imageUrl0, post.imageUrl1, post.imageUrl2, post.imageUrl3, post.imageUrl4, post.imageUrl5]} username={post.username} desc={post.desc}/>
                            {/* <div>{post.username} {post.desc} {post.email}</div> */}
                            <br />
                            <br />
                            <br />
                            <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <p>No posts to display</p>
                    <Link to="/posts/createposts">Create Post</Link>
                </div>
            )}
            <Link to="/posts/createposts"><h1>CreatePost</h1></Link>
        </article>
    );
};


export default Posts;












{/* <div>
<img
    src={post.imageUrl0}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
<img
    src={post.imageUrl1}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
<img
    src={post.imageUrl2}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
<img
    src={post.imageUrl3}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
<img
    src={post.imageUrl4}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
<img
    src={post.imageUrl5}
    alt={`${post.email}`}
    style={{ width: '150px', height: '150px' }}
/>
</div> */}