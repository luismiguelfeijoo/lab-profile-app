import React, { useContext, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, doEdit, doUpload, doLogout } from '../../lib/auth.api';
import { Card } from '../components/Card';
import { useForm, FormContext } from 'react-hook-form';
import { Input } from '../components/Input';
import {
  Left,
  Right,
  Title,
  Button3,
  Button2,
  Form,
  TextMinor,
  Image,
  ImageContainer
} from './utils/styles';

export const ProfilePage = withRouter(({ history }) => {
  const { user, setUser, setLoading } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    if (!user.username) {
      history.push('/');
    }
    setLoading(false);
  }, []);

  const methods = useForm({
    mode: 'onBlur'
  });

  const { register, handleSubmit, errors } = methods;

  const onSubmit = async data => {
    //console.log(data);
    setLoading(true);
    const newUser = await doEdit(data);
    if (newUser.username === data.username) {
      setUser(newUser);
    }
    setLoading(false);
  };

  return (
    <Card>
      <Left>
        <Title>Profile</Title>
        <FormContext {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='username'
              placeholder='Username'
              ref={register({
                required: 'Required *',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'invalid email address'
                }
              })}
              defaultValue={user.username}
            />
            <Input
              name='course'
              placeholder='Course'
              ref={register({
                required: 'Required *'
              })}
              defaultValue={user.course}
            />
            <Input
              name='campus'
              placeholder='Campus'
              ref={register({
                required: 'Required *'
              })}
              defaultValue={user.campus}
            />
            <Button2 type='submit'>Update</Button2>
          </Form>
        </FormContext>
        <Button3
          onClick={async () => {
            setUser(null);
            history.push('/');
            setLoading(true);
            const logout = await doLogout();
            setLoading(false);
          }}
        >
          Logout
        </Button3>
      </Left>
      <Right>
        <ImageContainer>
          <Image src={user.profilepic} />
        </ImageContainer>
        <TextMinor>
          Click to Upload a profile picture! This is done with NodeJs and
          multer, and stored on cloudinary
        </TextMinor>
      </Right>
    </Card>
  );
});