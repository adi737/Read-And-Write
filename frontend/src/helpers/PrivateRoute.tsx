import { State } from 'interfaces';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  path: string;
  exact: true;
  component: FC<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isLogged = useSelector((state: State) => state.user.isLogged);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isLogged ?
          <Component {...routeProps} />
          :
          <Redirect to='/' />
      }
    />
  );
}

export default PrivateRoute;