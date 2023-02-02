import { useAuthenticator, Heading, Button, Flex, Badge, TextAreaField, SelectField } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import { listTweets } from '../graphql/queries'
import { createTweet } from '../graphql/mutations'
import { onCreateTweet } from '../graphql/subscriptions'
import { CommunityContext } from './App';

export function PostPanel() {
  const { user } = useAuthenticator()
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    fetchTweets();
  }, [user]);

  async function fetchTweets() {
    const result = await API.graphql({ query: listTweets });
    const tweets = result.data.listTweets.items.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    setTweets(tweets);
  }

  return <Flex direction={'column'} flex='1'>
    <Heading level={5}>My Feed</Heading>
    <PostComposer />
    <Flex wrap="wrap">
      {tweets.map(tweet => <Post key={tweet.id} tweet={tweet} />)}
    </Flex>
  </Flex>
}

function PostComposer() {
  const { availableGroups } = useContext(CommunityContext)
  const options = availableGroups.filter(group => group.joined).map(group => group.name)

  const [content, setContent] = useState("")
  const [community, setCommunity] = useState("Everyone")

  function handleCreateTweet() {
    API.graphql({
      query: createTweet,
      variables: {
        input: {
          content,
          community
        }
      }
    })
  }

  return <Flex direction={'column'}>
    <TextAreaField
      label="Message"
      value={content}
      onChange={e => setContent(e.target.value)}
      placeholder="What's happening?" />
    <Flex>
      <SelectField
        flex='1'
        label="Post to ..."
        value={community}
        options={options}
        onChange={e => setCommunity(e.target.value)} />
      <Button alignSelf={'flex-end'} onClick={handleCreateTweet} variation="primary">Post</Button> 
    </Flex>
  </Flex>
}

function Post({tweet}) {
  return <Flex
    direction={'column'}
    padding={8}
    border={"1px solid black"}
    borderRadius={8}
    maxWidth={300}>
    <Flex wrap={'wrap'}>
      <Badge variation='success'>#{tweet.community}</Badge>
      <i>{new Date(tweet.createdAt).toLocaleString()}</i>
    </Flex>
    {tweet.content}
  </Flex>
}