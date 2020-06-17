import React from "react"
import logo from "./logo.svg"
import { Link } from "gatsby"
import "./style.css"

class Header extends React.Component {
  render() {
    const { location } = this.props

    const blogLinkStyle = {
      paddingBottom: location.pathname === "/" ? `5px` : `0px`,
      boxShadow: location.pathname === "/" ? `0px 1px 0px 0px black` : `none`,
    }

    const aboutLinkStyle = {
      paddingBottom: location.pathname === "/about" ? `5px` : `0px`,
      boxShadow:
        location.pathname === "/about" ? `0px 1px 0px 0px black` : `none`,
    }

    return (
      <div className="header-main">
         <h1 className="li-h1">
         <Link className="logo-link" to={`/`}>
          <strong>The Blog.</strong>
        </Link>
         </h1>
        
        <div className="header-nav">
          <ul className="nav-ul">
            <li className="nav-li">
              <h1 className="li-h1" style={blogLinkStyle}>
                <Link className="li-link" to={`/`}>
                  Blog
                </Link>
              </h1>
            </li>
            <li
              style={{
                float: "left",
              }}
            >
              <h1 className="li-h1" style={aboutLinkStyle}>
                <Link className="li-link" to={`/about`}>
                  About
                </Link>
              </h1>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header
