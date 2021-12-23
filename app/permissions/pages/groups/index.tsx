import { Button, Editable, EditableInput, EditablePreview, Flex, IconButton, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import Form from "app/core/components/Form";
import LabeledTextField from "app/core/components/LabeledTextField";
import Modal from "app/core/components/Modal";
import Pagination from "app/core/components/Pagination";
import { PermissionProps } from "app/pages/_app";
import addGroup from "app/permissions/mutations/groups/addGroup";
import changeGroupname from "app/permissions/mutations/groups/changeGroupname";
import deleteGroup from "app/permissions/mutations/groups/deleteGroup";
import addPermission from "app/permissions/mutations/permissions/addPermission";
import deletePermission from "app/permissions/mutations/permissions/deletePermission";
import getGroupPermissions from "app/permissions/queries/groups/getGroupPermissions";
import getGroups from "app/permissions/queries/groups/getGroups";
import { BlitzPage, useMutation, useQuery } from "blitz";
import { Group } from "db";
import { useState } from "react";
import { Suspense } from "react";
import { FaTrash } from "react-icons/fa";
import CreateableSelect from "react-select/creatable";
import { z } from "zod";

const GroupEntry = ({
  group,
  refetch,
}: {
  group: Group,
  refetch: () => Promise<any>,
}) => {
  const [permissions, { refetch: refetchPermissions }] = useQuery(getGroupPermissions, {
    id: group.id,
  });
  const defaultPermissions = permissions.map(({ id, name }) => ({ value: id, label: name }));
  const [deletePermissionMutation] = useMutation(deletePermission);
  const [addPermissionMutation] = useMutation(addPermission);

  const [groupnameMutation] = useMutation(changeGroupname);
  const [deleteGroupMutation] = useMutation(deleteGroup);
  

  return (
    <Tr>
      <Td>
        <Editable
          defaultValue={group.name}
          placeholder="Groupname"
          onSubmit={async (groupname) => {
            await groupnameMutation({
              groupId: group.id,
              groupname: groupname,
            });
          }}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Td>
      <Td>
        <CreateableSelect
          defaultValue={defaultPermissions}
          options={defaultPermissions}
          isMulti
          onChange={async (e, a) => {
            console.log(a);
            if (a.action === "remove-value") {
              await deletePermissionMutation({
                id: a.removedValue.value,
              });
            }
            if (a.action === "create-option" || a.action === "select-option") {
              await addPermissionMutation({
                groupId: group.id,
                name: (a as any).option.value, // todo: fix TS workaround
              });
            }
            await refetchPermissions();
          }}
        />
      </Td>
      <Td>
        <IconButton
          colorScheme="red"
          aria-label="Delete"
          icon={<FaTrash size={16} />}
          onClick={async () => {
            await deleteGroupMutation({
              id: group.id,
            });
            await refetch();
          }}
        />
      </Td>
    </Tr>
  );
};

const Groups = () => {
  const addGroupDisclosure = useDisclosure();
  const [addGroupMutation] = useMutation(addGroup);

  return (
    <Suspense fallback="Loading...">

        <Pagination<Group>
          pagination={getGroups}
        >
          {({ items, refetch }) => <Flex direction="column">
            <Flex justifyContent="center">
              <Button
                colorScheme="teal"
                onClick={addGroupDisclosure.onOpen}
              >
                Add Group
              </Button>
              <Modal
                disclosure={addGroupDisclosure}
                header="Add group"
                footer={
                  <Button
                    colorScheme="green"
                    form="addGroupForm"
                    type="submit"
                  >
                    Save
                  </Button>
                }
              >
                <Form
                  id="addGroupForm"
                  schema={z.object({
                    name: z.string().nonempty(),
                  })}
                  initialValues={{ name: "" }}
                  onSubmit={async ({ name }) => {
                    await addGroupMutation({
                      name: name,
                    });
                    addGroupDisclosure.onClose();
                    await refetch();
                  }}
                >
                  <LabeledTextField
                    name="name"
                    label="Name"
                    placeholder="Name"
                  />
                </Form>
              </Modal>
            </Flex>
            <Table>
              <Thead>
                <Tr>
                  <Th>Groupname</Th>
                  <Th>Permissions</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map(group => <GroupEntry
                  refetch={refetch}
                  key={group.id}
                  group={group}
                />)}
              </Tbody>
            </Table>
          </Flex>}
        </Pagination>
    </Suspense>
  )
}

const GroupsPage: BlitzPage & PermissionProps = () => {
  return (
    <Suspense fallback="Loading...">
      <Groups />
    </Suspense>
  );
}

GroupsPage.permission = "admin.groups.view";

export default GroupsPage;