import { Heading, Button, Badge, Flex, Text } from "@aws-amplify/ui-react";
import { useContext } from "react"
import { createAndJoinGroup, getAvailableGroups, getJoinedGroups, joinGroup, leaveGroup } from '../utils';
import { CommunityContext } from "./App";

export function GroupsPanel() {
  const { refreshGroups, availableGroups } = useContext(CommunityContext)

  async function handleCreateGroupClick() {
    await createAndJoinGroup(window.prompt('Group Name?'))
    refreshGroups()
  }

  async function handleGroupClick(groupName, joined) {
    if (joined) {
      await leaveGroup(groupName)
    } else {
      await joinGroup(groupName)
    }
    refreshGroups();
  }

  return <Flex direction={'column'}>
    <Flex justifyContent={'space-between'} alignItems='center'>
      <Heading level={5}>Group Memberships</Heading>
      <Button onClick={handleCreateGroupClick}>new</Button>
    </Flex>
    <Flex direction={"column"}>
      {availableGroups
        .filter(({ name }) => name !== "Everyone")
        .map(({ name, joined }) =>
          <Flex key={name}>
            <Badge variation={joined ? 'success' : ''}>
              #{name}
            </Badge>
            <Button
              size="small"
              variation="link"
              onClick={() => handleGroupClick(name, joined)}>
              {joined ? 'Leave' : 'Join'}
            </Button>
          </Flex>)}
    </Flex>
  </Flex>
}