import api from 'helpers/api';
import React from 'react'
import { Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import { useMutation, useQueryClient } from 'react-query';

interface ExperienceProps {
  exp: any;
}

export const Experience: React.FC<ExperienceProps> = ({ exp }) => {
  const queryClient = useQueryClient();

  const removeExperience = async (id: string) => {
    const { data } = await api.delete(`/profile/experience/${id}`);
    return data;
  }

  const { mutate: removeExp, isLoading: removeExperienceLoading } = useMutation((id: string) => removeExperience(id), {
    onSuccess(updatedProfile) {
      queryClient.setQueryData(['myProfile',], updatedProfile);
    }
  });

  const handleRemoveExperience = (id: string) => {
    if (window.confirm('Are you sure you want to delete the experience?'))
      removeExp(id);
  }

  return (
    <div key={exp._id} className='mb-5'>
      <p className='mb-1'>{exp.position}</p>
      <p className='mb-1'>{exp.company}</p>
      <p className='mb-1'>{exp.location}</p>
      <p className='font-weight-bold m-0'>
        Description:
      </p>
      <p className='mb-2'>{exp.description}</p>
      <small>
        <Moment format='YYYY.MM.DD'>
          {exp.from}
        </Moment>-
        {
          exp.current ?
            'now' :
            <Moment format='YYYY.MM.DD'>
              {exp.to}
            </Moment>
        }
      </small>
      {
        removeExperienceLoading ?
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
              handleRemoveExperience(exp._id)}
          >
            Delete
          </Button>
      }
    </div>
  );
}