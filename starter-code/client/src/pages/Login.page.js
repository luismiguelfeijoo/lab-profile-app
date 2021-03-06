import React, { useContext, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { UserContext, doLogin } from '../../lib/auth.api';
import { Card } from '../components/Card';
import { useForm, FormContext } from 'react-hook-form';
import { Input } from '../components/Input';
import {
  Left,
  Right,
  TextContainer,
  Title,
  Text,
  LinkUpdated2,
  Button2,
  Form,
  TextMinor,
  SubTitle
} from './utils/styles';
import { withProtected } from '../../lib/protectedRoute';

export const LoginPage = withProtected(
  withRouter(({ history }) => {
    const { user, setUser, setLoading } = useContext(UserContext);

    const methods = useForm({
      mode: 'onBlur',
      defaultValue: {
        username: '',
        password: ''
      }
    });

    const { register, handleSubmit, errors } = methods;

    const onSubmit = async data => {
      setLoading(true);
      try {
        const newUser = await doLogin(data);
        setUser(newUser);
        history.push('/profile');
        errors.username = { type: 'pattern', message: 'Try again' };
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    return (
      <Card>
        <Left>
          <Title>Login</Title>
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
              />
              <Input
                name='password'
                type='password'
                placeholder='Password'
                ref={register({
                  required: 'Required *'
                })}
              />
              <Button2 type='submit'>Login</Button2>
            </Form>
          </FormContext>
        </Left>
        <Right>
          <TextContainer>
            <SubTitle>Hello IronHacker!</SubTitle>
            <Text>Awesome to have you here again!!!</Text>
          </TextContainer>
          <TextMinor>
            If you sign don't have an account register{' '}
            <LinkUpdated2 to='/signup'>here</LinkUpdated2>
          </TextMinor>
        </Right>
      </Card>
    );
  }),
  { redirect: true, redirectTo: 'profile', inverted: true }
);
