import { Helmet } from "react-helmet-async";

function ReactHelmet({ title }) {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title} | 청춘온 관리자페이지</title>
      <meta name="og:title" content={title} />
      <meta name="og:image" content="../assets/ch_icon.jpg" />
      <meta
        name="description"
        content="치매 예방 글쓰기 앱 플랫폼, 청춘온 관리자페이지"
      />
    </Helmet>
  );
}

export default ReactHelmet;
