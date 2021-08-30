import React from 'react'
import { Link } from 'react-router-dom';

const AccountMessage = () => (
  <>
    <p className='text-center mt-5 mb-0 lead'>Account has been created</p>
    <p className='text-center m-0'> <Link to='/login' className='text-decoration-none'>Sign in</Link></p>
  </>
);

export default AccountMessage;