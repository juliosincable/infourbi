import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface AnonymousRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const AnonymousRoute: React.FC<AnonymousRouteProps> = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        !currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/prueba" />
        )
      }
    />
  );
};

export default AnonymousRoute;
