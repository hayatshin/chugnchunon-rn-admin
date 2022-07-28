import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import client, { isLoggedInVar, tokenVar } from "./apollo";
import Home from "./screens/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Statistics from "./screens/Statistics";
import Manage from "./screens/Manage";
import Notice from "./screens/Notice";
import Info from "./screens/Info";
import Rank from "./screens/Rank";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  useEffect(() => {
    async function prepare() {
      try {
        const token = window.localStorage.getItem("token");
        if (token) {
          tokenVar(token);
          isLoggedInVar(true);
        }
      } catch (e) {
        console.log(e);
      }
    }
    prepare();
  }, []);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {isLoggedIn ? (
          <Routes>
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/info" element={<Info />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/notice" element={<Notice />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        )}
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
