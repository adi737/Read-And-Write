import React from 'react';
import Loader from 'helpers/Loader';
import ProfileIcon from 'components/utils/ProfileIcon';
import { Col, Container, Row } from 'react-bootstrap';
import api from 'helpers/api';
import { useQuery } from 'react-query';

const Profiles = () => {
  const getProfiles = async () => {
    const res = await api.get('/profile/profiles');
    const data = await res.data;
    return data;
  }

  const { data: profiles, isLoading } = useQuery('profiles', getProfiles);

  return (
    isLoading ?
      <Loader />
      :
      profiles.length === 0 ?
        <p className='text-center mt-4 display-4'>No article has been added</p>
        :
        <Container>
          <section className='mt-3'>
            <Row xs={1} sm={2} lg={3} xl={4}>
              {
                profiles.map(profile =>
                  <Col key={profile._id}>
                    <ProfileIcon profile={profile} />
                  </Col>
                )
              }
            </Row>
          </section>
        </Container>
  );
}

export default Profiles;