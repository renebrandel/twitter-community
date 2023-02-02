import { Button, Divider, Flex, useAuthenticator, View } from '@aws-amplify/ui-react'
import { useEffect, createContext, useState } from 'react';
import { getAvailableGroups } from '../utils';
import { GroupsPanel } from './GroupsPanel';
import { PostPanel } from './PostPanel';

export const CommunityContext = createContext({
  availableGroups: [],
  refreshGroups: () => null
})

function App() {
  const { user, signOut } = useAuthenticator()
  const [availableGroups, setAvailableGroups] = useState([])

  useEffect(() => { refreshGroups() }, [])

  async function refreshGroups() {
    setAvailableGroups(await getAvailableGroups())
  }
  
  return (
    <CommunityContext.Provider value={{ availableGroups, refreshGroups }}>
      <Flex direction={"column"} width="100vw">
        <View alignSelf="end">
          <b>{user.attributes.email}</b>
          <Button variation='link' onClick={signOut}>Sign out</Button>
        </View>
        <Flex padding={8}>
          <PostPanel />
          <Divider orientation='vertical' />
          <GroupsPanel />
        </Flex>
      </Flex>
    </CommunityContext.Provider>
  );
}

export default App;