import React from 'react';
import FadeIn from 'react-fade-in';
import styled from 'styled-components';
import { Icon } from 'src/components';

const FakeInput = styled.div`
  border: 0;
  border-radius: 6px;
  padding: 12px 15px 10px;
  background-color: rgba(0,68,102,.06);
  transition: box-shadow .3s ease,background .3s ease;
  font-size: 13px;
  height: 40px;
  color: #777;
`;

const UploadedImageWrapper = styled.div`
  position: relative;

  img {
    width: 100%;
    border-radius: 8px;
    image-orientation: from-image;
  }

  .icon {
    cursor: pointer;
    position: absolute;
    color: #000;
    background: rgba(255,255,255,0.5);
    border-radius: 100%;
    right: 10px;
    top: 10px;
  }
`;

const UploadedImage = ({src, alt, close}) => (
  <UploadedImageWrapper>
    <Icon onClick={close}>close</Icon>
    <img src={src} alt={alt} />
  </UploadedImageWrapper>
);


const FileUploader = ({style, close, onChange, images, placeholder, formats, ...props}) => (
  <div>
    {images.length === 0 ?
      <React.Fragment>
        <label htmlFor="fileInput">
          <FakeInput style={style}>{placeholder}</FakeInput> 
        </label>
        <input {...props} accept={formats} style={{display: 'none'}} id="fileInput" type='file' onChange={onChange} />
      </React.Fragment>
      :
      images.map(i => <FadeIn key={i._id}><UploadedImage src={i.src} alt='' close={() => close(i._id)} /></FadeIn>)
    }
  </div>
)

export default FileUploader;