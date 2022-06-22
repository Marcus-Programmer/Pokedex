import React,{useState} from "react"
import {searchPokemon} from "../api"

const Searchbar = () => {
    
    const [pokemon, setPokemon] = useState()
    const onSearchHandler = async (pokemon) =>{
        const result = await searchPokemon(pokemon)
        setPokemon(result)
      }

    const [search,setSearch] = useState("ditto")
    
    const onChangeHandler= (e) =>{
        setSearch(e.target.value)
    }
    
    const onButtonClickHandler = () => {
      onSearchHandler(search)
        
    }
    
    return(
        <div className="searchbar-container">
            <div className="searchbar">
                <input placeholder="Buscar pokemon" onChange={onChangeHandler}/>
            </div>
            <div className="searchbar-btn">
                <button onClick={onButtonClickHandler} >Buscar</button>
            </div>
            {pokemon ? (
                <div>
                <div>Nome:{pokemon.name}</div>
                <div>Peso:{pokemon.weight}</div>
                <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
                </div>
            )
            : null}
        </div>
    )


}

export default Searchbar;