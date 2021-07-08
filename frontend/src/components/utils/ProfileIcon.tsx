import { ProfileState } from 'interfaces';
import React from 'react';
import { Card, Image, ListGroup, ListGroupItem } from 'react-bootstrap';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

interface ProfileIconProps {
  profile: ProfileState
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ profile: { status, date, _id: id, userID: { nick, avatar } } }) => (
  <article className='my-3'>
    <Card className='text-center'>
      <Card.Header>
        <Image
          rounded
          width={50}
          height={50}
          src={avatar}
          alt="avatar"
        />
        <small className='text-center m-0 text-muted d-block'>{nick}</small></Card.Header>
      <ListGroup className="list-group-flush">
        <ListGroupItem className='text-truncate'>{status}</ListGroupItem>
      </ListGroup>
      <Card.Body>
        <Card.Link as={'div'}>
          <Link to={`/profile/${id}`} className='text-decoration-none'>
            <i className="fas fa-user"></i> View profile
          </Link>
        </Card.Link>
      </Card.Body>
      <Card.Footer className="text-muted">
        <small className='font-italic'>
          Created on{" "}
          <Moment format="DD.MM.YYYY HH:mm:ss">{date}</Moment>
        </small>
      </Card.Footer>
    </Card>
  </article>
);


export default ProfileIcon;