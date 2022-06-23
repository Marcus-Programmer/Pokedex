import React, { useEffect, useState } from "react";
import { getPokemonData, getPokemons, searchPokemon } from "./api";
import "./App.css";
import Navbar from "./Components/Navbar";
import Pokedex from "./Components/Pokedex";
import Searchbar from "./Components/Searchbar";
import { FavoriteProvider } from "./contexts/favoriteContext";

const favoritesKey = ""
function App() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notFound,setNotFound] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  

  const itensperPage = 32;
  const fetchPokemons = async () => {
    try {
      setLoading(true);
      setNotFound(false)
      const data = await getPokemons(itensperPage, itensperPage * page);
      const promises = data.results.map(async (pokemon) => {
        return await getPokemonData(pokemon.url);
      });

      const results = await Promise.all(promises);
      setPokemons(results);
      setLoading(false);
      setTotalPages(Math.ceil(data.count / itensperPage));
    } catch (error) {
      console.log("fetchPokemons erro: ", error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [page]);
  const loadFavoritePokemons = () =>{
    const pokemons = JSON.parse(window.localStorage.getItem(favoritesKey)) || []
      setFavorites(pokemons)
  }
  useEffect(() => {
    loadFavoritePokemons()  }, []);

  const updateFavoritePokemons = (name) => {
    const updatedFavorites = [...favorites];
    const favoriteIndex = favorites.indexOf(name);
    if (favoriteIndex >= 0) {
      updatedFavorites.slice(favoriteIndex, 1);
    } else {
      updatedFavorites.push(name);
    }
    window.localStorage.setItem(favoritesKey,JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites);
  };
  const onSearchHandler = async (pokemon) =>{
    if(!pokemon){
      return fetchPokemons();
    }
    setLoading(true)
    setNotFound(false)
    const result = await searchPokemon(pokemon)
    if(!result){
      
      setNotFound(true)
    }else{
      setPokemons([result])
      setPage(0)
      setTotalPages(1)
    }
    setLoading(false)
    
  }
  return (
    <FavoriteProvider
      value={{
        favoritePokemons: favorites,
        updateFavoritePokemons: updateFavoritePokemons,
      }}
    >
      <div>
        <Navbar />
        <Searchbar onSearch ={onSearchHandler}/>
        {notFound ?(
          <div className="not-found-text">ih</div>
        ) :
        (<Pokedex
          pokemons={pokemons}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />)}
      </div>
    </FavoriteProvider>
  );
}

export default App;
