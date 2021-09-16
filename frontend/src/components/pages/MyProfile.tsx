import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from 'helpers/Loader';
import { Col, Container, Nav, Row, Tab, Image, Button, Spinner } from 'react-bootstrap';
import UpdateStatus from 'components/forms/UpdateStatus';
import UpdateSkills from 'components/forms/UpdateSkills';
import UpdateMedia from 'components/forms/UpdateMedia';
import AddExperience from 'components/forms/AddExperience';
import AddEducation from 'components/forms/AddEducation';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from 'helpers/api';
import { Experience } from 'components/utils/Experience';
import { Education } from 'components/utils/Education';
import CreateProfile from 'components/forms/CreateProfile';
import { DELETE_ACCOUNT } from 'reducers/types';

const MyProfile = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate: deleteAccount, isLoading: deleteAccountLoading } = useMutation(() => api.delete('/user'), {
    onSuccess() {
      dispatch({
        type: DELETE_ACCOUNT
      });
    }
  });
  const { mutate: deleteProfile, isLoading: deleteProfileLoading } = useMutation(() =>
    api.delete('/profile').then(res => res.data), {
    onSuccess(deletedProfile) {
      const profilesCache = queryClient.getQueryData('profiles');

      if (profilesCache) {
        queryClient.setQueryData('profiles', (profiles: any) => profiles.filter(profile => profile._id !== deletedProfile._id));
      }

      queryClient.setQueryData('myProfile', null);
    }
  });

  const getYourProfile = async () => {
    const { data } = await api.get('/profile');
    return data;
  }

  const { data: profile, isLoading } = useQuery('myProfile', getYourProfile, {
    staleTime: Infinity,
    cacheTime: Infinity
  });

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete the profile?'))
      deleteProfile();
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete the account?'))
      deleteAccount();
  }

  return (
    isLoading ?
      <Loader />
      :
      !profile ?
        <>
          <p className='text-center mt-4 display-4 mb-1'>
            You do not have a profile yet
          </p>
          <Button
            size='lg'
            className='d-block mx-auto mb-4'
            onClick={() => setShowProfile(true)}
          >
            Create profile
          </Button>
          {
            showProfile ?
              <CreateProfile
                show={showProfile}
                onHide={() => setShowProfile(false)}
              /> : null
          }
          <h2 className='text-center'>Do you want to delete your account? Then your profile and your articles will also be deleted</h2>
          {
            deleteAccountLoading ?
              <Button variant='danger' className='d-block mx-auto mb-4' disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> loading...
              </Button>
              :
              <Button variant='danger' className='d-block mx-auto mb-4' onClick={handleDeleteAccount}>Delete account</Button>
          }
        </>
        :
        <Container className='my-3'>
          <section>
            <Tab.Container id="left-tabs-example" defaultActiveKey="status">
              <Row>
                <Col md={3} lg={2}>
                  <Nav variant="pills" className="justify-content-center mb-3">
                    <Nav.Item>
                      <Nav.Link className='user-select-none' eventKey="status">Status</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className='user-select-none' eventKey="experience">
                        Exp / Edu
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col md={9} lg={10}>
                  <Tab.Content>
                    <Tab.Pane eventKey="status">
                      <Row sm={3}>
                        <Col sm={4} className="border py-3">
                          <article className="text-center">
                            <p className="m-0 lead font-weight-bold">{profile.userID && profile.userID.nick}</p>
                            <Image
                              roundedCircle
                              src={profile.userID && profile.userID.avatar}
                              alt="avatar"
                              width={60}
                              height={60}
                            />
                            {
                              deleteProfileLoading ?
                                <Button
                                  variant='outline-danger'
                                  size='sm'
                                  className='d-block mx-auto mt-2'
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
                                  className='d-block mx-auto mt-2'
                                  onClick={() =>
                                    handleDeleteProfile()}
                                >
                                  Delete Profile
                                </Button>
                            }
                          </article>
                        </Col>
                        <Col className="border position-relative py-3">
                          <Button
                            variant="custom"
                            className="position-absolute"
                            onClick={() => setShowStatus(true)}
                          >
                            <i className="far fa-edit"></i>
                          </Button>
                          {
                            showStatus ?
                              <UpdateStatus
                                show={showStatus}
                                onHide={() => setShowStatus(false)}
                              /> : null
                          }
                          <article>
                            <h4 className="mb-1">Status: </h4>
                            <i className="d-block mb-1">{profile.status}</i>
                            <p className="mb-1">{profile.company}</p>
                            <p className="m-0 text-muted font-italic">{profile.location}</p>
                          </article>
                        </Col>
                        <Col className="border position-relative py-3">
                          <Button
                            variant="custom"
                            className="position-absolute"
                            onClick={() => setShowSkills(true)}
                          >
                            <i className="far fa-edit"></i>
                          </Button>
                          {
                            showSkills ?
                              <UpdateSkills
                                show={showSkills}
                                onHide={() => setShowSkills(false)}
                              /> : null
                          }
                          <article>
                            <h4 className="m-0">Skills: </h4>
                            <ul className="pl-4">
                              {
                                profile.skills ?
                                  profile.skills.map((skill, index) =>
                                    <li key={`${skill}${index}`}>{skill}</li>
                                  )
                                  :
                                  ''
                              }
                            </ul>
                          </article>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="border position-relative py-3">
                          <Button
                            variant="custom"
                            className="position-absolute"
                            onClick={() => setShowMedia(true)}
                          >
                            <i className="far fa-edit"></i>
                          </Button>
                          {
                            showMedia ?
                              <UpdateMedia
                                show={showMedia}
                                onHide={() => setShowMedia(false)}
                              /> : null
                          }
                          <article className="text-center d-flex justify-content-around media">
                            <a rel="noopener noreferrer" target="_blank" href={profile.linkedin}>
                              <i className="user-select-none fab fa-linkedin"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={profile.facebook}>
                              <i className="user-select-none fab fa-facebook-square"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={profile.instagram}>
                              <i className="user-select-none fab fa-instagram-square"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={profile.youtube}>
                              <i className="user-select-none fab fa-youtube"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={profile.twitter}>
                              <i className="user-select-none fab fa-twitter"></i>
                            </a>
                          </article>
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="experience">
                      <Row sm={2}>
                        <Col className="border position-relative py-3">
                          <article>
                            <Button
                              size='sm'
                              className='mb-2'
                              onClick={() => setShowExperience(true)}
                            >
                              Add Experience
                            </Button>
                            {
                              showExperience ?
                                <AddExperience
                                  show={showExperience}
                                  onHide={() => setShowExperience(false)}
                                />
                                : null
                            }
                            <h4 className='mb-2'>Experience:</h4>
                            {
                              profile.experience ?
                                profile.experience.map(exp => <Experience key={exp._id} exp={exp} />)
                                : ''
                            }
                          </article>
                        </Col>
                        <Col className="border position-relative py-3">
                          <article>
                            <Button
                              size='sm'
                              className='mb-2'
                              onClick={() => setShowEducation(true)}
                            >
                              Add Education
                            </Button>
                            {
                              showEducation ?
                                <AddEducation
                                  show={showEducation}
                                  onHide={() => setShowEducation(false)}
                                /> : null
                            }
                            <h4 className='mb-2'>Education:</h4>
                            {
                              profile.education ?
                                profile.education.map(edu => <Education key={edu._id} edu={edu} />)
                                : ''
                            }
                          </article>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </section>
        </Container >
  );
}

export default MyProfile;