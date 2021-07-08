import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfiles, cleanProfileState } from 'actions/profile.action';
import Loader from 'helpers/Loader';
import ProfileIcon from 'components/utils/ProfileIcon';
import { Col, Container, Row } from 'react-bootstrap';
import { State } from 'interfaces';

const Profiles = () => {
  const dispatch = useDispatch();
  const profiles = useSelector((state: State) => state.profile.profiles);
  const loading = useSelector((state: State) => state.profile.loading);

  useEffect(() => {
    dispatch(getProfiles());

    return () => {
      dispatch(cleanProfileState());
    }
  }, [dispatch]);

  return (
    loading ?
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