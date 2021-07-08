import React, { useCallback } from 'react'
import { Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

interface ErrorProps {
  children: React.ReactNode
  id: string
  type: string
}

const Error: React.FC<ErrorProps> = ({ children, id, type }) => {
  const dispatch = useDispatch();

  const handleOnClose = useCallback(() => {
    dispatch({ type, payload: id });
  }, [dispatch, id, type]);

  return (
    <Alert variant='danger' onClose={handleOnClose} dismissible>
      {children}
    </Alert>
  )
}

export default React.memo(Error);