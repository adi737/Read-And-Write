import api from 'helpers/api';
import React from 'react'
import { Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import { useMutation, useQueryClient } from 'react-query';

interface EducationProps {
  edu: any;
}

export const Education: React.FC<EducationProps> = ({ edu }) => {
  const queryClient = useQueryClient();

  const removeEducation = async (id: string) => {
    const { data } = await api.delete(`/profile/education/${id}`);
    return data;
  }

  const { mutate: removeEdu, isLoading: removeEducationLoading } = useMutation((id: string) => removeEducation(id), {
    onSuccess(updatedProfile) {
      queryClient.setQueryData(['myProfile',], updatedProfile);
    }
  });

  const handleRemoveEducation = (id: string) => {
    if (window.confirm('Are you sure you want to delete the education?'))
      removeEdu(id);
  }

  return (
    <div key={edu._id} className='mb-5'>
      <p className='mb-1'>{edu.school}</p>
      <p className='mb-1'>{edu.fieldofstudy}</p>
      <p className='mb-1'>{edu.degree}</p>
      <p className='font-weight-bold m-0'>
        Description:
                                    </p>
      <p className='mb-2'>{edu.description}</p>
      <small>
        <Moment format='YYYY.MM.DD'>
          {edu.from}
        </Moment>-
        {
          edu.current ?
            'now' :
            <Moment format='YYYY.MM.DD'>
              {edu.to}
            </Moment>
        }
      </small>
      {
        removeEducationLoading ?
          <Button
            variant='outline-danger'
            size='sm'
            className='d-block'
            disabled
          >
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            /> loading...
            </Button>
          :
          <Button
            variant='outline-danger'
            size='sm'
            className='d-block'
            onClick={() =>
              handleRemoveEducation(edu._id)}
          >
            Delete
          </Button>
      }
    </div>
  );
}