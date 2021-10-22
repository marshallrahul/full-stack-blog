import React from 'react';

import { ImageContainer } from "./image-preview.style";

const ImagePreview = ({ preview }) => (
  <ImageContainer>
    <img src={preview} alt="" />
  </ImageContainer>
)

export default ImagePreview;