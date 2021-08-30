import React from 'react';
import Loader from 'helpers/Loader';
import Moment from 'react-moment';
import { Col, Container, Image, Nav, Row, Tab } from 'react-bootstrap';
import { useQuery } from 'react-query';
import api from 'helpers/api';
import NotFound from './NotFound';

interface ProfileProps {
  match: {
    params: {
      id: string;
    }
  }
}

const Profile: React.FC<ProfileProps> = ({ match: { params: { id } } }) => {
  const { data: profile, isLoading } = useQuery(['profile', id], () => api.get(`/profile/${id}`).then(res => res.data));

  return isLoading ?
    <Loader />
    : !profile ?
      <NotFound />
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
                    {
                      profile.experience && profile.experience.length === 0 &&
                        profile.education && profile.education.length === 0 ?
                        <Nav.Link className='user-select-none' disabled eventKey="experience">
                          Exp / Edu
                      </Nav.Link>
                        :
                        <Nav.Link className='user-select-none' eventKey="experience">
                          Exp / Edu
                      </Nav.Link>
                    }
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={9} lg={10}>
                <Tab.Content>
                  <Tab.Pane eventKey="status">
                    <Row sm={3}>
                      <Col sm={4} className="border py-3">
                        <article className="text-center">
                          <p className="m-0 lead font-weight-bold">{profile?.userID && profile?.userID.nick}</p>
                          <Image
                            roundedCircle
                            src={profile?.userID && profile?.userID.avatar}
                            alt="avatar"
                            width={60}
                            height={60}
                          />
                        </article>
                      </Col>
                      <Col className="border position-relative py-3">
                        <article>
                          <h4 className="mb-1">Status: </h4>
                          <i className="d-block mb-1">{profile?.status}</i>
                          <p className="mb-1">{profile?.company}</p>
                          <p className="m-0 text-muted font-italic">{profile?.location}</p>
                        </article>
                      </Col>
                      <Col className="border position-relative py-3">
                        <article>
                          <h4 className="m-0">Skills: </h4>
                          <ul className="pl-4">
                            {
                              profile?.skills ?
                                profile?.skills.map(skill => <li key={skill}>{skill}</li>)
                                :
                                ''
                            }
                          </ul>
                        </article>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="border position-relative py-3">
                        <article className="text-center d-flex justify-content-around media">
                          <a rel="noopener noreferrer" target="_blank" href={profile?.linkedin}>
                            <i className="fab fa-linkedin user-select-none"></i>
                          </a>
                          <a rel="noopener noreferrer" target="_blank" href={profile?.facebook}>
                            <i className="user-select-none fab fa-facebook-square"></i>
                          </a>
                          <a rel="noopener noreferrer" target="_blank" href={profile?.instagram}>
                            <i className="user-select-none fab fa-instagram-square"></i>
                          </a>
                          <a rel="noopener noreferrer" target="_blank" href={profile?.youtube}>
                            <i className="user-select-none fab fa-youtube"></i>
                          </a>
                          <a rel="noopener noreferrer" target="_blank" href={profile?.twitter}>
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
                          <h4 className='mb-2'>Experience:</h4>
                          {
                            profile?.experience ?
                              profile?.experience.map(exp =>
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
                                </div>
                              )
                              :
                              ''
                          }
                        </article>
                      </Col>
                      <Col className="border position-relative py-3">
                        <article>
                          <h4 className='mb-2'>Education:</h4>
                          {
                            profile?.education ?
                              profile?.education.map(edu =>
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
}

export default Profile;