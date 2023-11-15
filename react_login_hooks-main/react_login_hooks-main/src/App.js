import Register from './pages/Register';
import Login from './pages/Login';
import Layout from './components/Layout';
import Editor from './components/Editor';
import Admin from './components/Admin';
import Missing from './pages/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './pages/Lounge';
import LinkPage from './pages/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Posts from './pages/Posts';
import { Landing } from './pages/Landing';
import { Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import CreatePost from './pages/CreatePost';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

export function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<Landing />}/>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />


        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin, ROLES.User]} />}>
        <Route path="posts" element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
          <Route path="" element={<Posts />} />
        </Route>

        <Route path="posts" element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]} />}>
          <Route path="createposts" element={<CreatePost />} />
        </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

// export default App;