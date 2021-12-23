
import { Box, Divider, Text, HStack, VStack, Link as ChakraLink } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import { BlitzPage, useQuery, Link as BlitzLink } from "blitz"
import { Forum } from "db";
import { Suspense } from "react";
import { FaBook } from "react-icons/fa";
import getForumsTree from "../forums/queries/getForumsTree"

const ForumsView = ({
  header,
  id,
  forums,
  marginLeft = 0,
}: {
  header: string,
  id: number,
  forums: Forum[],
  marginLeft?: number,
}) => {
  return (
    <Box>
      <HStack marginLeft={marginLeft}>
        <Icon as={FaBook} boxSize={8} />
        <Text as="h2" fontSize={32}>
          <ChakraLink
            as={BlitzLink}
            href={`/forums/${id}`}
          >
            {header}
          </ChakraLink>
        </Text>
      </HStack>
      {forums
        .map(forum => <ForumsView key={forum.id} id={forum.id} header={forum.name} forums={(forum as any).forums} marginLeft={marginLeft + 4} />)
        .reduce((prev, curr) => ([prev, <Divider />, curr] as any), "")
      }
    </Box>
  );
};

const ForumsTree = () => {
  const [forumsTree] = useQuery(getForumsTree, null);

  return (
    <Box key={0} rounded={25} borderStyle="solid" borderWidth="2px" borderColor="gray.500" width="100%">
      {forumsTree
        .map(forum => <ForumsView key={forum.id} id={forum.id} header={forum.name} forums={(forum as any).forums} />)
        .reduce((prev, curr) => ([prev, <Divider />, curr] as any))}
    </Box>
  );
}

const ForumsTreePage: BlitzPage = () => {

  return (
    <Suspense fallback="Loading...">
      <ForumsTree />
    </Suspense>
  )
}

export default ForumsTreePage;
