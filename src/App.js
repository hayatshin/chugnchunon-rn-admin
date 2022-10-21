import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import client, { isLoggedInVar, tokenVar } from "./apollo";
import Home from "./screens/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Statistics from "./screens/Statistics";
import Manage from "./screens/Manage";
import Notice from "./screens/Notice";
import Rank from "./screens/Rank";
import Activity from "./screens/Activity";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  useEffect(() => {
    async function prepare() {
      try {
        const token = window.sessionStorage.getItem("token");
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
      <HelmetProvider>
        <BrowserRouter>
          {isLoggedIn ? (
            <Routes>
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/rank" element={<Rank />} />
              <Route path="/notice" element={<Notice />} />
            </Routes>
          ) : (
            <Routes>
              <Route exact path="/" element={<Home />} />
            </Routes>
          )}
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
