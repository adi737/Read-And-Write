import React from 'react'
import { Container } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import Alert from './Alert';

const body: HTMLBodyElement = document.querySelector('body')!;

interface AlertsProps {
  authErrors: {
    errors: {
      msg: String;
    }[];
    id: string;
  }[];

  profileErrors: {
    errors: {
      msg: String;
    }[];
    id: string;
  }[];

  articleErrors: {
    errors: {
      msg: String;
    }[];
    id: string;
  }[];
}



const Alerts: React.FC<AlertsProps> = ({ authErrors, profileErrors, articleErrors }) => {
  console.log(authErrors)
  return (
    createPortal(
      authErrors.length !== 0 ?
        <div className='alerts'>
          <Container>
            {
              authErrors.map(authError => authError.errors.map(error =>
                <Alert
                  type={'AUTH_RESET_ERROR_ALERT'}
                  id={authError.id}
                  key={`${authError.id}${error.msg}`}>
                  {error.msg}
                </Alert>)
              )
            }
          </Container>
        </div>
        :
        profileErrors.length !== 0 ?
          <div className='alerts'>
            <Container>
              {
                profileErrors.map(profileError => profileError.errors.map(error =>
                  <Alert
                    type={'PROFILE_RESET_ERROR_ALERT'}
                    id={profileError.id}
                    key={`${profileError.id}${error.msg}`}>
                    {error.msg}
                  </Alert>)
                )
              }
            </Container>
          </div>
          :
          articleErrors.length !== 0 ?
            <div className='alerts'>
              <Container>
                {
                  articleErrors.map(articleError => articleError.errors.map(error =>
                    <Alert
                      type={'ARTICLE_RESET_ERROR_ALERT'}
                      id={articleError.id}
                      key={`${articleError.id}${error.msg}`}
                    >{error.msg}
                    </Alert>)
                  )
                }
              </Container>
            </div>
            :
            null,
      body
    )
  );
}

export default Alerts;