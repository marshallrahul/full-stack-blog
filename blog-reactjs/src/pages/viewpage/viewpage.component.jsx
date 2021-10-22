import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";

import { ViewContainer, Image, Title, Content, ImageContainer } from "./viewpage.style";

const ViewPage = () => {
  const mountedRef = useRef(true);
  const { postId } = useParams();
  const [post, setPost] = useState({ title: "", imageUrl: "", content: "" });
  const { title, imageUrl, content } = post;

  useEffect(() => {
    if (mountedRef.current) {
      const graphqlQuery = {
        query: `
          {
            post(postId: "${postId}") {
              title
              content
              imageUrl
            }
          }
        `
      }
      fetch(`http://localhost:8080/graphql`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphqlQuery)
      })
        .then(res => {
          return res.json();
        })
        .then(resData => {
          if (resData.errors) {
            throw new Error('Failed to fetch posts!');
          }
          console.log(resData);
          setPost({
            title: resData.data.post.title,
            imageUrl: `http://localhost:8080/${resData.data.post.imageUrl}`,
            content: resData.data.post.content
          });
        })
        .catch(err => {
          console.log(err);
        })
    }
    return () => {
      mountedRef.current = false;
    };
  }, [postId])

  return (
    <>
      <ViewContainer>
        <Title>{title}</Title>
        <ImageContainer>
          <Image src={imageUrl} alt={postId} />
        </ImageContainer>
        <Content>{content}</Content>
      </ViewContainer>
    </>
  )
};

export default ViewPage;