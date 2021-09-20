import React, { useState } from 'react';
import { storage } from 'firebaseSet/index';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import api from 'helpers/api';
import { useMutation, useQueryClient } from 'react-query';
import { toErrorMap } from 'helpers/toErrorMap';

interface FileUploadProps {
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ id }) => {
  const [file, setFile] = useState<File>();
  const queryClient = useQueryClient();
  const [error, setError] = useState<any>(null);

  const changeFile = (e: any) => {
    setFile(e.target.files[0]);
  }


  const uploadPictureToArticle = async (imgUrl: string) => {
    const formData = new FormData();
    formData.append('imgUrl', imgUrl);
    formData.append('file', file!);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    };

    const { data } = await api.post(`/article/upload/${id}`, formData, config);

    return data;
  }


  const handleFireBaseUpload = async e => {
    e.preventDefault()

    if (!file!.name.includes('.jpg') && !file!.name.includes('.jpeg')
      && !file!.name.includes('.gif') && !file!.name.includes('.png')
      && !file!.name.includes('.svg')) {
      return alert('Not allowed extension. Use one of these (.jpg | .jpeg | .gif | .png | .svg')
    }

    if (file!.size > 2097152) {
      return alert('The maximum file size is 2MB');
    }

    try {
      const imgRef = storage.ref('images').child(file!.name);
      await imgRef.put(file!);
      const imgUrl = await imgRef.getDownloadURL();

      return uploadPictureToArticle(imgUrl);

    } catch (error: any) {
      console.error(error.response.data)
    }
  }

  const { mutate, isLoading } = useMutation(handleFireBaseUpload, {
    onSuccess(updatedArticle) {
      setError(null);
      const articleCache = queryClient.getQueryData(['article', id]);

      if (articleCache) {
        queryClient.setQueryData(['article', id], updatedArticle);
      }

      queryClient.setQueryData('myArticles', (articles: any) =>
        articles.map(article => article._id === updatedArticle._id ? updatedArticle : article));
    },
    onError(err: any) {
      setError(toErrorMap(err.response.data.errors));
    }
  });

  return (
    <Form onSubmit={mutate} className='mb-3'>
      <Form.File id="formcheck-api-custom" custom >
        <Form.File.Input
          onChange={changeFile}
          type='file'
          accept="image/*"
          isValid
          required
        />
        {
          error?.file ? <Alert className="mt-2" variant='danger'>{error.file}</Alert> : null
        }
        <Form.File.Label data-browse="Browse">
          Click or drag
        </Form.File.Label>
        {
          file ?
            <Form.Control.Feedback type="valid">
              {file.name}
            </Form.Control.Feedback>
            :
            null
        }
        {
          isLoading ?
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              /> loading...
            </Button>
            :
            <Button className='mt-1' type="submit">
              Upload file
            </Button>
        }
      </Form.File>
    </Form>
  );
}


export default FileUpload;