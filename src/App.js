import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home";
import Movie from "./pages/movie";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/:id" exact element={<Movie />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
