import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';

//App and store and private route
import App from './App';
import store from './store';
import PrivateRoute from './components/PrivateRoute';

//Import sub pages
import Intro from './pages/Intro';
import NewPost from './pages/NewPost';
import ListPosts from './pages/ListPosts';
import AllPosts from './pages/AllPosts';
import GetPost from './pages/GetPost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Success from './pages/Success';
import Error404 from './pages/Error404';

//Create the ClientBrowserRouter
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element = { <App /> } >
			<Route index = { true } path='/' element = { <Intro /> } />
      <Route path="/listposts" element={ <ListPosts /> } />
      <Route path="/allposts" element={ <AllPosts /> } />
      <Route path="/getpost" element={ <ListPosts /> } />
      <Route path="/getpost/:id" element={ <GetPost /> } />
      <Route path="/login" element = { <Login />} />

      {/*PRIVATE ROUTES*/}
      <Route path='' element= { <PrivateRoute /> }>
        <Route path="/newpost" element={ <NewPost /> } />
        <Route path="/editpost" element = { <NewPost />} />
        <Route path="/editpost/:id" element = { <EditPost />} />
        <Route path="/success" element={ <Success /> } />
      </Route>

      {/*ERROR ROUTE*/}
      <Route path='*' element={<Error404 />} />
		</Route>
	)
);

//Create the Root
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={ store } >
    <React.StrictMode>
      <RouterProvider router={ router } />
    </React.StrictMode>
  </Provider>
);