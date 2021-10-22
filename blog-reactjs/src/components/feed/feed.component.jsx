import React, { useState, useEffect, useCallback, useRef } from 'react';

import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import ImagePreview from "../image-preview/image-preview.component";
import Status from "../status/status.component";
import CollectionItem from "../collection-item/collection-item.component";
import Pagination from "../pagination/pagination.component";

import {
  NewPostContainer,
  TitleContainer,
  Container,
  ButtonContainer,
  WrapperContainer,
  PopUp,
  PostsContainer
} from "./feed.styles";

const Feed = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");
  const [userInput, setUserInput] = useState({ id: "", title: "", content: "", imageUrl: "" });
  const [hidden, setHidden] = useState(true);
  const [posts, setPosts] = useState({ items: [] });
  const currentPage = useRef(1);
  const POST_PER_PAGE = 2;
  const [edit, setEdit] = useState(false);
  const fileSelected = useRef(false);
  const [paginate, setPaginate] = useState({ hasPrev: false, hasNext: false })

  // Toogle hidden form
  const buttonHandler = () => {
    setHidden(current => !current);
    setEdit(false);
    clearState();
  }

  const { id, title, content, imageUrl } = userInput;

  // Load the path of the image
  const onFileChange = event => {
    fileSelected.current = true;
    setSelectedFile(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
      }
    }
    reader.readAsDataURL(event.target.files[0]);
  };

  // Reset state values
  const clearState = () => {
    setUserInput({ id: "", title: "", content: "", imageUrl: "" });
    setSelectedFile("");
    setPreview("");
  };

  // let imagePath = '';

  // Post data to Backend 
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);
    buttonHandler();
    clearState()

    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: formData,
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        let graphqlQuery;
        if (edit) {
          graphqlQuery = {
            query: `
            mutation {
              updatePost(id: "${id}", inputData: {title: "${title}", imageUrl: "${resData.file !== imageUrl ? resData.file : imageUrl}", content: "${content}"}) {
                _id
                title
                content
              }
            }        
          `,
          }
        } else {
          graphqlQuery = {
            query: `
              mutation {
                createPost(inputData: {title: "${title}", imageUrl: "${resData.file}", content: "${content}"}) {
                  _id
                }
              }
            `,
          };
        }

        return fetch('http://localhost:8080/graphql', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(graphqlQuery),
        })
      })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          console.log(resData.errors)
        }
        setEdit(false);
        loadPosts();
      })
      .catch(err => {
        console.log(err);
      })
  }

  // Post to delete
  const deleteHandler = (postId) => {
    const graphqlQuery = {
      query: `
        mutation {
          deletePost(id: "${postId}") {
            _id
          }
        }
      `,
    }

    fetch(`http://localhost:8080/graphql`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        clearState();
        loadPosts();
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          console.log(resData.errors);
          throw new Error('Deleting a post failed!');
        }
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      })
  }

  // Fetch data from Database 
  const loadPosts = useCallback(
    () => {
      const graphqlQuery = {
        query: `
          {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
              updatedAt
            }
          }
        `
      }
      fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery)
      })
        .then(res => {
          return res.json();
        })
        .then(resData => {
          console.log(resData)
          if (resData.errors) {
            throw new Error('Failed to fetch posts!');
          }
          if (resData !== null) {
            setPosts({
              ...posts, items: resData.data.posts.map((post) => {
                return {
                  ...post
                }
              })
            })
          }
        }).catch(err => {
          console.log(err);
        })
    },
    // eslint-disable-next-line
    [],
  )

  useEffect(() => {
    loadPosts();
    setEdit(false);
  }, [loadPosts])

  // Save user input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserInput({ ...userInput, [name]: value })
  }

  // Render buttons
  const renderButton = () => {
    if (selectedFile !== null && title !== null && content !== null) {
      return <CustomButton type="submit">ACCEPT</CustomButton>;
    }

    return (
      <CustomButton disable disabled>ACCEPT</CustomButton>
    );
  }

  // Post to edit
  const editHandler = (postId) => {
    setHidden(current => !current);
    setEdit(current => !current);
    const graphqlQuery = {
      query: `
        {
          post(postId: "${postId}") {
            _id
            title
            content
            imageUrl
          }
        }
      `
    }
    fetch(`http://localhost:8080/graphql `, {
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
        console.log(resData);
        if (resData.errors) {
          throw new Error('Failed to fetch posts!');
        }
        setUserInput({
          id: resData.data.post._id,
          title: resData.data.post.title,
          content: resData.data.post.content,
          imageUrl: resData.data.post.imageUrl
        });
        setSelectedFile(resData.data.post.imageUrl);
      })
      .catch(err => {
        console.log(err);
      })
  }


  // Paginations
  useEffect(() => {
    if (posts.items.length > 1) {
      setPaginate({ hasPrev: false, hasNext: true });
    }
  }, [posts.items.length])

  const totalPosts = posts.items.length;
  const indexOfLastPost = currentPage.current * POST_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POST_PER_PAGE;
  const currentPosts = posts.items.slice(indexOfFirstPost, indexOfLastPost);

  const previousHandler = () => {
    currentPage.current = currentPage.current - 1;
    if (currentPage.current <= 1) {
      setPaginate({ hasPrev: false, hasNext: true });
      return;
    }
    setPaginate({ hasPrev: true, hasNext: true });
  }

  const nextHandler = () => {
    currentPage.current = currentPage.current + 1;
    if ((Math.ceil(totalPosts / POST_PER_PAGE)) <= currentPage.current) {
      setPaginate({ hasPrev: true, hasNext: false });
      return;
    }
    setPaginate({ hasPrev: true, hasNext: true });
  }

  return (
    <>
      <WrapperContainer>
        <Status />
        <CustomButton onClick={buttonHandler} newPost>NEW POST</CustomButton>
        {/* LIST OF POSTS */}
        <PostsContainer>
          {
            posts.items.length > 0 ?
              currentPosts.map(({ _id, title, creator, createdAt }) => {
                return (
                  // SINGLE POST
                  <CollectionItem
                    key={_id}
                    id={_id}
                    title={title}
                    name={creator.name}
                    createdAt={new Date(createdAt).toLocaleDateString()}
                    editHandler={() => editHandler(_id)}
                    deleteHandler={() => deleteHandler(_id)}
                  />
                )
              }) : null
          }
        </PostsContainer >
        {/* FORM */}
        {
          !hidden ?
            <PopUp>
              <NewPostContainer>
                <TitleContainer>New Post</TitleContainer>
                <Container>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <FormInput
                      name="title"
                      type="text"
                      onChange={handleChange}
                      value={title}
                      label="TITLE"
                      placeholder="Title"
                      required
                    />
                    <FormInput
                      name="image"
                      type="file"
                      onChange={onFileChange}
                      label="IMAGE"
                    />
                    {/* IMAGE BOX */}
                    <ImagePreview
                      preview={fileSelected.current ? preview : `http://localhost:8080/${selectedFile}`} />
                    <FormInput
                      name="content"
                      type="text"
                      onChange={handleChange}
                      value={content}
                      label="CONTENT"
                      textArea
                      required
                    />
                    <ButtonContainer>
                      <CustomButton type="button" onClick={buttonHandler} cancel>CANCEL</CustomButton>
                      {renderButton()}
                    </ButtonContainer>
                  </form>
                </Container>
              </NewPostContainer>
            </PopUp> : null
        }
        {
          posts.items.length > 1 && (totalPosts !== POST_PER_PAGE || totalPosts < POST_PER_PAGE)
            ?
            <Pagination
              onPrev={previousHandler}
              onNext={nextHandler}
              hasPrev={paginate.hasPrev}
              hasNext={paginate.hasNext}
            />
            : null
        }
      </WrapperContainer>
    </>
  )
};

export default Feed;