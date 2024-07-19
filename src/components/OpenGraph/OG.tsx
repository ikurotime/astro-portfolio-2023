export default function OG(
  title: string = 'David Huertas - Software Engineer',
  heroImageURL: string
) {
  const basePath = 'http://localhost:3001/'
  const backgroundImageURL = `${basePath}opengraph/background.png`
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left',
        backgroundRepeat: 'no-repeat',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <h1
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          padding: '2rem 4rem',
          fontSize: '4rem',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          fontWeight: 'bold',
          color: 'black',
          fontFamily: 'Inter',
          wordBreak: 'break-word'
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          margin: '2.5rem'
        }}
      >
        <img
          src={`${basePath}blog/${heroImageURL}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '24px'
          }}
        />
      </div>
      {/*  <img
        src={`${basePath}opengraph/logo-badge.png`}
        style={{ position: 'absolute', bottom: '0', right: '0', zIndex: 100 }}
        width='146px'
      /> */}
    </div>
  )
}
