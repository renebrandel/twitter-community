import { API, Auth } from 'aws-amplify';

const API_NAME = 'AdminQueries';

export async function getAvailableGroups() {
  const availableGroups = await listAllGroups()
  const joinedGroups = await listJoinedGroups()

  console.log(availableGroups, joinedGroups)

  return availableGroups.Groups.map(group => ({
    name: group.GroupName,
    joined: joinedGroups.includes(group.GroupName)
  }))
}

async function listAllGroups() {
  return await API.get(
    API_NAME,
    '/listGroups',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    });
}

export async function listJoinedGroups() {
  const result = await API.get(
    API_NAME,
    '/listGroupsForMe',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    }
  )
  return result.Groups.map(group => group.GroupName)
}

export async function createAndJoinGroup(groupName) {
  await API.post(
    API_NAME,
    '/addGroupAndJoinMe',
    {
      body: {
        groupname: groupName
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    });
  await invalidateRefreshToken();
}

export async function leaveGroup(groupName) {
  await API.post(
    API_NAME,
    '/removeMeFromGroup',
    {
      body: {
        groupname: groupName
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    });
  await invalidateRefreshToken();
}

export async function joinGroup(groupName) {
  await API.post(
    API_NAME,
    '/addMeToGroup',
    {
      body: {
        groupname: groupName
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    });
  await invalidateRefreshToken();
}

async function invalidateRefreshToken() {
  await Auth.currentUserPoolUser({ bypassCache: true });
}