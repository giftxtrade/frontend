import { Component } from "react";
import { User } from '../store/jwt-payload';
import { authStore } from '../store/auth-store';
import Router from 'next/router'
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box } from '@chakra-ui/react'

export default class Home extends Component<{
  loggedIn: boolean,
  gToken: string,
  user: User,
  loading: false,
}> {
  state = {
    loggedIn: false,
    accessToken: '',
    gToken: '',
    user: { id: 0, name: '', email: '', imageUrl: '' },
    loading: false
  }

  componentDidMount() {
    authStore.subscribe(() => {
      const { loggedIn, gToken, user } = authStore.getState()
      this.setState({ gToken, user, loggedIn })
      if (!loggedIn)
        Router.push('/')
    })
  }

  render() {
    return (
      <Flex
        direction="row"
        alignItems="center"
        justifyContent='start'
        p='20'
      >
        <Image src={this.state.user.imageUrl} mr='3' rounded='md' />
        <div>
          <Heading size='md'>{this.state.user.name}</Heading>
          <Text>{this.state.user.email}</Text>

          <Link href="/">
            <Button size='sm' mt='3'>Logout</Button>
          </Link>
        </div>
      </Flex>
    )
  }
}