import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  let userRole = null;
  if (isAuthenticated) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          roles && !roles.includes(userRole) ? (
            <Redirect to="/unauthorized" />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;