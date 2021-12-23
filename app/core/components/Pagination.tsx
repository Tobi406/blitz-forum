import { ButtonGroup, Flex, Icon, IconButton } from "@chakra-ui/react";
import { QueryFn, usePaginatedQuery, useRouter } from "blitz";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 3;

function Pagination<T> ({
  pagination,
  children,
}: {
  pagination: QueryFn,
  children: ({
    items,
  }: {
    items: T[],
    refetch: () => Promise<any>,
  }) => void,
}) {
  const router = useRouter();
  const page = Number(router.query.page) || 0;

  const [{ items, hasMore }, { refetch }] = usePaginatedQuery(pagination, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 }});
  const goToNextPage = () => router.push({ query: { page: page + 1 }});

  const Control = () => {
    return (
      <ButtonGroup>
        <IconButton
          aria-label="Go to previous page"
          disabled={page === 0}
          icon={<Icon as={FaChevronLeft} />}
          onClick={goToPreviousPage}
        />
        <IconButton
          aria-label="Go to next page"
          disabled={!hasMore}
          icon={<Icon as={FaChevronRight} />}
          onClick={goToNextPage}
        />
      </ButtonGroup>
    );
  };
  
  return (
    <Flex direction="column">
      <Control />
      {children({
        items,
        refetch,
      })}
      <Control />
    </Flex>
  );
};

export default Pagination;
