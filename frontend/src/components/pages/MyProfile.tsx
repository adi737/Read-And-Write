import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getYourProfile, cleanProfileState, removeExperience, removeEducation, deleteProfile } from 'actions/profile.action';
import Loader from 'helpers/Loader';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { deleteAccount } from 'actions/user.action';
import { Col, Container, Nav, Row, Tab, Image, Button } from 'react-bootstrap';
import UpdateStatus from 'components/forms/UpdateStatus';
import UpdateSkills from 'components/forms/UpdateSkills';
import UpdateMedia from 'components/forms/UpdateMedia';
import AddExperience from 'components/forms/AddExperience';
import AddEducation from 'components/forms/AddEducation';
import { State } from 'interfaces';

const MyProfile = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  const profile = useSelector((state: State) => state.profile.profile);
  const loading = useSelector((state: State) => state.profile.profile.loading);

  const { userID, status, company, location, skills, experience, education, youtube, twitter, facebook, linkedin, instagram } = profile;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getYourProfile());

    return () => {
      dispatch(cleanProfileState());
    }
  }, [dispatch]);

  const handleRemoveExperience = useCallback(id => {
    if (window.confirm('Are you sure you want to delete the experience?'))
      dispatch(removeExperience(id))
  }, [dispatch]);

  const handleRemoveEducation = useCallback(id => {
    if (window.confirm('Are you sure you want to delete the education?'))
      dispatch(removeEducation(id))
  }, [dispatch]);

  const handleDeleteProfile = useCallback(() => {
    if (window.confirm('Are you sure you want to delete the profile?'))
      dispatch(deleteProfile())
  }, [dispatch]);

  const handleDeleteAccount = useCallback(() => {
    if (window.confirm('Are you sure you want to delete the account?'))
      dispatch(deleteAccount())
  }, [dispatch]);

  return (
    loading ?
      <Loader />
      :
      Object.keys(profile).length === 1 && profile.constructor === Object ?
        <>
          <p className='text-center mt-4 display-4 mb-1'>
            You do not have a profile yet
          </p>
          <Button size='lg' className='d-block mx-auto mb-4'>
            <Link className='text-reset text-decoration-none' to='createProfile'>
              Create profile
            </Link>
          </Button>
          <h2 className='text-center'>Do you want to delete your account? Then your profile and your articles will also be deleted</h2>
          <Button variant='danger' className='d-block mx-auto mb-4' onClick={handleDeleteAccount}>Delete account</Button>
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
                            <p className="m-0 lead font-weight-bold">{userID && userID.nick}</p>
                            <Image
                              roundedCircle
                              src={userID && userID.avatar}
                              alt="avatar"
                              width={60}
                              height={60}
                            />
                            <Button
                              variant='outline-danger'
                              size='sm'
                              className='d-block mx-auto mt-2'
                              onClick={() =>
                                handleDeleteProfile()}
                            >
                              Delete Profile
                                    </Button>
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
                          <UpdateStatus
                            show={showStatus}
                            onHide={() => setShowStatus(false)}
                          />
                          <article>
                            <h4 className="mb-1">Status: </h4>
                            <i className="d-block mb-1">{status}</i>
                            <p className="mb-1">{company}</p>
                            <p className="m-0 text-muted font-italic">{location}</p>
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
                          <UpdateSkills
                            show={showSkills}
                            onHide={() => setShowSkills(false)}
                          />
                          <article>
                            <h4 className="m-0">Skills: </h4>
                            <ul className="pl-4">
                              {
                                skills ?
                                  skills.map((skill, index) =>
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
                          <UpdateMedia
                            show={showMedia}
                            onHide={() => setShowMedia(false)}
                          />
                          <article className="text-center d-flex justify-content-around media">
                            <a rel="noopener noreferrer" target="_blank" href={linkedin}>
                              <i className="user-select-none fab fa-linkedin"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={facebook}>
                              <i className="user-select-none fab fa-facebook-square"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={instagram}>
                              <i className="user-select-none fab fa-instagram-square"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={youtube}>
                              <i className="user-select-none fab fa-youtube"></i>
                            </a>
                            <a rel="noopener noreferrer" target="_blank" href={twitter}>
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
                            <AddExperience
                              show={showExperience}
                              onHide={() => setShowExperience(false)}
                            />
                            <h4 className='mb-2'>Experience:</h4>
                            {
                              experience ?
                                experience.map(exp =>
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
                                      </Moment>
                                  -
                                  {
                                        exp.current ?
                                          'now' :
                                          <Moment format='YYYY.MM.DD'>
                                            {exp.to}
                                          </Moment>
                                      }
                                    </small>
                                    <Button
                                      variant='outline-danger'
                                      size='sm'
                                      className='d-block'
                                      onClick={() =>
                                        handleRemoveExperience(exp._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                )
                                :
                                ''
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
                            <AddEducation
                              show={showEducation}
                              onHide={() => setShowEducation(false)}
                            />
                            <h4 className='mb-2'>Education:</h4>
                            {
                              education ?
                                education.map(edu =>
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
                                      </Moment>
                                      -
                                      {
                                        edu.current ?
                                          'now' :
                                          <Moment format='YYYY.MM.DD'>
                                            {edu.to}
                                          </Moment>
                                      }
                                    </small>
                                    <Button
                                      variant='outline-danger'
                                      size='sm'
                                      className='d-block'
                                      onClick={() =>
                                        handleRemoveEducation(edu._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                )
                                :
                                ''
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