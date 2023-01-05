import Head from "next/head"

const MetaTag = ({ title, des, image }) => {
  const t = `${title} - Feed`
  const d = "There is no place like feed."
  const img = image
    ? image
    : "https://lh3.googleusercontent.com/ogw/AOh-ky3Q8So3pvL3-iy2-vj2eT-m_aBHOKdrtCMWRjbARg=s32-c-mo"

  return (
    <Head>
      {/* main */}
      <meta name="title" content={title ? t : "Feed"} />
      <meta name="description" content={des ? des : d} />
      <meta name="keywords" content="blog,dev,web" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Muhammad Danish" />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      {typeof window !== "undefined" && (
        <meta property="og:url" content={window.location.href} />
      )}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={des ? des : d} />
      <meta property="og:image" content={img} />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="user_profile" />
      <meta property="twitter:site" content="@danissjjd" />
      {typeof window !== "undefined" && (
        <meta property="twitter:url" content={window.location.href} />
      )}
      <meta property="twitter:title" content={title} />
      <meta property="twitter:image" content={img} />
      <meta property="twitter:description" content={des ? des : d} />

      <title>{title ? t : "Feed"}</title>
    </Head>
  )
}

export default MetaTag
