/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowDown,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "./App.css";

function App() {
  const [Movies, setMovies] = useState([]); // for storing movies
  const [defaultMovies, setDefaultMovies] = useState([]); //for default movies
  const [searchSection, setSearchSection] = useState(""); // for search input
  const [loadingSection, setLoadingSection] = useState(false); //  for loading status
  const [page, setPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle States
  const [ShowSearchBar, setShowSearchBar] = useState(false); // Toggle search bar
  const [ShowYearBar, setShowYearBar] = useState(false); // Toggle year filter
  const [ShowGenreBar, setShowGenreBar] = useState(false); // Toggle genre filter
  const [ShowFilterOptions, setShowFilterOptions] = useState(false); // Toggle filter options
  const [filterType, setFilterType] = useState("none");
  const [filterYear, setFilterYear] = useState(false);
  const [filterGenre, setFilterGenre] = useState(false);

  // On Errors
  const [allMoviesLoaded, setAllMoviesLoaded] = useState(false);
  const [noMoviesFound, setNoMoviesFound] = useState(false);

  const API_key = "e718ca00";

  // Function to fetch movies from the OMDB API
  const fetchMovies = async (searchTerm, page) => {
    if (allMoviesLoaded || loadingSection) return;

    setLoadingSection(true);

    let url = `http://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=${API_key}`;

    if (filterYear) {
      url += `&y=${filterYear}`;
    } else if (filterGenre) {
      url += `&genre=${filterGenre}`;
    }

    try {
      const response = await axios.get(url);

      if (response.data.Response === "True" && response.data.Search) {
        setMovies((prevMovies) => [...prevMovies, ...response.data.Search]);

        if (page >= Math.ceil(parseInt(response.data.totalResults) / 10)) {
          setAllMoviesLoaded(true);
        }
      } else {
        if (page === 1) {
          setMovies([]);
        }
      }
    } catch (error) {
      console.log("Error while fetching movies:", error);
    } finally {
      setLoadingSection(false);
    }
  };

  // Handle scrolling and infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 &&
        !loadingSection &&
        !allMoviesLoaded
      ) {
        setPage((prevPage) => prevPage + 1);
      }

      // For scrolling navbar behavior
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up on unmount
  }, [loadingSection, allMoviesLoaded]);

  // Fetch default movies
  useEffect(() => {
    const defaultMoviesList = ["Inception", "The Matrix", "Interstellar", "Her", "Avatar"];
    if (!searchSection) {
      defaultMoviesList.forEach((title) => {
        fetchMovies(title, page); // Fetch default movies
      });
    }
  }, [page, searchSection]);

  // Fetch movies when search input changes
  useEffect(() => {
    if (searchSection.length > 2) {
      setMovies([]);
      fetchMovies(searchSection, 1);
    }
  }, [searchSection]);

  // Toggle the search bar
  const toggleSearchBar = () => {
    setShowSearchBar(!ShowSearchBar);
  };

  // Toggle the filter section
  const toggleFilterOptions = () => {
    setShowFilterOptions(!ShowFilterOptions);
  };

  // Toggle the year filter bar
  const toggleYearbar = () => {
    setShowYearBar(!ShowYearBar);
  };

  // Toggle the genre filter bar
  const toggleGenrebar = () => {
    setShowGenreBar(!ShowGenreBar);
  };

  return (
    <div className="App">
      <div id="home" className="Container">
        {isScrolled && (
          <>
            <nav id="home" className="navBarUp">
              {!noMoviesFound && !defaultMovies && (
                <div className="navBarUpLeft">
                  {searchSection ? (
                    <h2>Searched: {searchSection}</h2>
                  ) : (
                    <h2>Search Movies</h2>
                  )}
                </div>
              )}
              <div className="navBarUpCenter">
                <h1>Movie Browser</h1>
              </div>
              <div className="navBarUpRight">
                <div className="filterSection">
                  <button onClick={toggleFilterOptions}>
                    <FontAwesomeIcon icon={faFilter} />
                  </button>
                  {ShowFilterOptions && (
                    <div className="filterSectionDropdown">
                      <button
                        className="dropdownOption"
                        onClick={toggleYearbar}
                      >
                        Year
                      </button>
                      <button
                        className="dropdownOption"
                        onClick={toggleGenrebar}
                      >
                        Genre
                      </button>
                    </div>
                  )}
                </div>
                <a className="searchSectionSearchBar">
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "white" }}
                    size="2x"
                    onClick={toggleSearchBar}
                  />
                </a>
                {ShowSearchBar && (
                  <div className="togglingSearchBarContainer">
                    <input
                      className="inputSearch"
                      type="text"
                      placeholder="Search Movies here..."
                      onChange={(e) => {
                        setSearchSection(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>
            </nav>
            {ShowYearBar && (
              <div className="yearBarContainer">
                <h3>Select Year:</h3>
                <div className="yearBar">
                  {["2020", "2019", "2018", "2017", "2016", "2015", "2014"].map(
                    (year) => (
                      <button
                        key={year}
                        className="yearButton"
                        onClick={() => setFilterYear(year)}
                      >
                        {year}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
            {ShowGenreBar && (
              <div className="genreButtonsContainer">
                <h3>Select Genre:</h3>
                {["Action", "Drama", "Comedy", "Horror", "Sci-Fi"].map(
                  (genre) => (
                    <button
                      key={genre}
                      className="genreButton"
                      onClick={() => setFilterGenre(genre)}
                    >
                      {genre}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
        {!isScrolled && (
          <>
            <a href="/home" className="mainPageHeaderAsLink">
              <h1 className="mainPageHeader">Movie Browser</h1>
            </a>
            <input
              className="input"
              type="text"
              placeholder="Search movies here......."
              onChange={(e) => setSearchSection(e.target.value)}
            />
            <div className="downButtonDiv">
              <button
                onClick={() => setPage((prevPage) => prevPage + 1)}
                className="downButton"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
              <p>Default Movies</p>
            </div>
          </>
        )}

        <div className="cardsContainer">
          {Movies.length > 0 ? (
            Movies.map((movie) => (
              <div key={movie.imdbID} className="movieCard">
                <img
                  className="MoviewPoster"
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "public/defaultImage.jpg"
                  }
                  alt={movie.Title}
                />
                <p>Year: {movie.Year}</p>
                <h2>{movie.Title}</h2>
              </div>
            ))
          ) : !noMoviesFound ? (
            <p className="noMoviesFound">No movies found!</p>
          ) : null}
        </div>
        {loadingSection && <p>Loading more movies...</p>}
        {allMoviesLoaded && <p>No more movies to load.</p>}
      </div>
    </div>
  );
}

export default App;
