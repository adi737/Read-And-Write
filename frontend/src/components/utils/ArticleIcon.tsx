import { ArticleState } from 'interfaces';
import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

interface ArticleIconProps {
  article: ArticleState
}

const ArticleIcon: React.FC<ArticleIconProps> = ({ article: { _id: id, topic, intro, date, userID: { nick, avatar } } }) => (
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
      <Card.Body>
        <Card.Title className='text-truncate'>{topic}</Card.Title>
        <Card.Text className='text-truncate'>
          {intro}
        </Card.Text>
        <Link to={`/article/${id}`} className='text-decoration-none text-reset'>
          <Button className='mt-1' size='sm' variant="outline-primary">
            <i className="fas fa-book-reader"></i> Read article
          </Button>
        </Link>
      </Card.Body>
      <Card.Footer className="text-muted">
        <small className='font-italic'>
          Posted on{" "}
          <Moment format="DD.MM.YYYY HH:mm:ss">{date}</Moment>
        </small>
      </Card.Footer>
    </Card>
  </article>
);


export default ArticleIcon;