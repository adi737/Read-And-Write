import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadPictureToArticle } from 'actions/article.action';
import { v4 as uuidv4 } from 'uuid';
import { storage } from 'firebaseSet/index';
import { Button, Form, Spinner } from 'react-bootstrap';

interface FileUploadProps {
  id: string;
}

interface isFile {
  size: number;
  name: string;
  file: Blob | Uint8Array | ArrayBuffer;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
  slice: (start?: number | undefined, end?: number | undefined, contentType?: string | undefined) => Blob;
  stream: () => ReadableStream<any>;
  text: () => Promise<string>;
}

const FileUpload: React.FC<FileUploadProps> = ({ id }) => {
  const [file, setFile] = useState<isFile>();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const changeFile = useCallback(e => {
    setFile(e.target.files[0]);
  }, [setFile]);


  const handleFireBaseUpload = useCallback(async e => {
    e.preventDefault()
    setLoading(true);

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

      const uuid = uuidv4();
      dispatch(uploadPictureToArticle(id, file!, imgUrl, uuid, setLoading));

    } catch (error) {
      console.log(error.response.data)
    }

  }, [file, dispatch, id]);

  return (
    <Form onSubmit={handleFireBaseUpload} className='mb-3'>
      <Form.File id="formcheck-api-custom" custom >
        <Form.File.Input
          onChange={changeFile}
          type='file'
          accept="image/*"
          isValid
          required
        />
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
          loading ?
            <Button variant="primary" type="submit" disabled>
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