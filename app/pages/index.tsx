import { Container } from "@chakra-ui/react"
import useHasPermission from "app/auth/hooks/useHasPermission"
import { BlitzPage } from "blitz"
import { Suspense } from "react"

const UserInfo = () => {
  const canViewForums = useHasPermission("forums.view");  

  return <>
    {!canViewForums && <>'No Forums :('{JSON.stringify(canViewForums)}</>}
    {canViewForums && <>'Hey, I can view the Forums, pretty dope me I think'{JSON.stringify(canViewForums)}</>}
    
  </>;
}

const Home: BlitzPage = () => {
  
  return (
    <Container>
      <Suspense fallback="Loading...">
        <UserInfo />
      </Suspense>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true

export default Home
