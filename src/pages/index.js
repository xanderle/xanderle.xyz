import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import '../css/global.css'
import { css } from "@emotion/core"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges.filter(
    edge => edge.node.frontmatter.template === "post"
  )

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article
            key={node.fields.slug}
            css={css`
            &:hover {
              /* background-color: #d0d0d0; */
              box-shadow: 4px 4px 5px 0px rgba(189,189,189,1);
              transform: scale(1.005);
            }
            border: none;
            transition: transform .2s;
            transition: box-shadow .2s;
            /* margin-top: -15px; */
            margin-bottom: 35px;
            border: 0.5px solid #eeeeee;
            padding-left: 10px;
            padding-right: 10px;
          `}
          >
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 10),
                  marginTop: rhythm(1/2)
                }}
              >
                <Link
                  style={{
                    boxShadow: `none`,
                    color: "#000000",
                    fontSize: `21px`,
                    fontWeight: `400`,
                    fontFamily: `Montserrat`,
                  }}
                  to={node.fields.slug}
                >
                  {title}
                </Link>
              </h3>
              <small
                style={{
                  color: "#B7B7B7",
                  fontSize: `11px`,
                  fontWeight: `300`,
                }}
              >
                {node.frontmatter.date}
              </small>
            </header>
            <section
              style={{ color: "#888888", fontSize: `17px`, fontWeight: `300` }}
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            template
            title
            tags
            
            slug
            category
          }
        }
      }
    }
  }
`