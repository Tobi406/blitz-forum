import { Button, Editable, EditableInput, EditablePreview, IconButton, Menu, MenuButton, MenuItem, MenuList, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Form from "app/core/components/Form";
import LabeledTextField from "app/core/components/LabeledTextField";
import Modal from "app/core/components/Modal";
import Pagination from "app/core/components/Pagination";
import { PermissionProps } from "app/pages/_app";
import addUserGroup from "app/permissions/mutations/users/addUserGroup";
import changeEmail from "app/permissions/mutations/users/changeEmail";
import changeUsername from "app/permissions/mutations/users/changeUsername";
import deleteUser from "app/permissions/mutations/users/deleteUser";
import removeUserGroup from "app/permissions/mutations/users/removeUserGroup";
import getAllGroups from "app/permissions/queries/groups/getAllGroups";
import getUserGroups from "app/permissions/queries/groups/getUserGroups";
import getUsers from "app/permissions/queries/users/getUsers";
import { BlitzPage, useMutation, useQuery } from "blitz";
import { User } from "db";
import { Suspense } from "react";
import { FaEllipsisV, FaEnvelope, FaTrash } from "react-icons/fa";
import Select from "react-select";
import { z } from "zod";

const UserEntry = ({
  user,
  refetch,
}: {
  user: User,
  refetch: () => Promise<any>,
}) => {
  const [usernameMutation] = useMutation(changeUsername);

  const [userGroups, { refetch: refetchUserGroups }] = useQuery(getUserGroups, {
    id: user.id,
  });
  const userGroupsModified = userGroups.map(({ id, name }) => ({ value: id, label: name }));
  const [allGroups, { refetch: refetchAllGroups }] = useQuery(getAllGroups, {});
  const allGroupsModified = allGroups.map(({ id, name }) => ({ value: id, label: name }));
  const [removeUserGroupMutation] = useMutation(removeUserGroup);
  const [addUserGroupMutation] = useMutation(addUserGroup);
  const [deleteUserMutation] = useMutation(deleteUser);

  const emailDisclosure = useDisclosure();
  const [emailMutation] = useMutation(changeEmail);

  return (
    <Tr>
      <Td>
        <Editable
          defaultValue={user.name}
          placeholder="Username"
          onSubmit={async (username) => {
            await usernameMutation({
              userId: user.id,
              username: username,
            });
          }}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Td>
      <Td>
        <Select
          isMulti
          defaultValue={userGroupsModified}
          options={allGroupsModified}
          onChange={async (e, a) => {
            if (a.action === "remove-value") {
              await removeUserGroupMutation({
                userId: user.id,
                groupId: a.removedValue.value,
              });
            }
            if (a.action === "select-option") {
              await addUserGroupMutation({
                userId: user.id,
                groupId: (a.option as any).value, // todo: fix TS workaround
              });
            }
            await refetchUserGroups();
            await refetchAllGroups();
          }}
        />
      </Td>
      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaEllipsisV size={16} />}
          />
          <MenuList>
            <MenuItem
              icon={<FaEnvelope size={16} />}
              onClick={emailDisclosure.onOpen}
            >
              Change E-Mail
              <Modal
                disclosure={emailDisclosure}
                header="Change E-Mail"
                footer={
                  <Button
                    colorScheme="green"
                    form="emailForm"
                    type="submit"
                  >
                    Save
                  </Button>
                }
              >
                <Form
                  id="emailForm"
                  schema={z.object({
                    email: z.string().email(),
                  })}
                  initialValues={{ email: "" }}
                  onSubmit={async ({ email }) => {
                    await emailMutation({
                      email: email,
                      userId: user.id,
                    });
                    emailDisclosure.onClose();
                  }}
                >
                  <LabeledTextField
                    name="email"
                    label="New Email" 
                    placeholder="New Email" 
                  />
                </Form>
              </Modal>
            </MenuItem>
            <MenuItem
              icon={<FaTrash size={16} />}
              onClick={async () => {
                await deleteUserMutation({
                  id: user.id,
                });
                await refetch();
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

const Users = () => {
  return (
    <Suspense fallback="Loading...">
      <Pagination<User>
        pagination={getUsers}
      >
        {({ items, refetch }) => <Table>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Groups</Th>
              <Th>Options</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(user => <UserEntry
              refetch={refetch}
              key={user.id}
              user={user} 
            />)}
          </Tbody>
        </Table>}
      </Pagination>
    </Suspense>
  )
}

const UsersPage: BlitzPage & PermissionProps = () => {
  return (
    <Suspense fallback="Loading...">
      <Users />
    </Suspense>
  );
}

UsersPage.permission = "admin.users.view";

export default UsersPage;

