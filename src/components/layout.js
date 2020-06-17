import React from "react"
import { rhythm } from "../utils/typography"
import Header from "./Header"
import styled from "@emotion/styled"

function Layout({ location, title, children }) {
  const rootPath = `${__PATH_PREFIX__}/`

  const Container = styled.div`
    margin-left: auto;
    margin-right: auto;
    max-width: ${rhythm(32)};
    padding: ${rhythm(1)} ${rhythm(2 / 4)} 0 ${rhythm(2 / 4)};
    font-family: Montserrat;
  `

  const Body = styled.main`
    min-height: calc(100vh - 120px);
    /* border: 0.5px solid #eeeeee; */
    /* border-bottom: 0px; */
    /* border-radius: 10px 10px 0px 0px; */
    padding-left: 30px;
    padding-right: 30px;
    padding-top: -20px;
  `
  return (
    <Container>
      <header>
        <Header location={location} />{" "}
      </header>
      <Body>{children}</Body>
    </Container>
  )
}

export default Layout
