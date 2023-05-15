import { useState, useEffect } from 'react'
import './App.css'

const totalLocations = 108
const baseURL = 'https://rickandmortyapi.com/api'
const itemsPerPage = 10

function getRandomNumber(max) {
  return Math.floor(Math.random() * max)
}

function App() {
  // Search state
  const [id, setId] = useState(getRandomNumber(totalLocations))
  const [textInput, setTextInput] = useState('')
  const [location, setLocation] = useState(null)
  const [page, setPage] = useState(0)
  const [totalResidents, setTotalResidents] = useState(0)

  const onChange = ({ target }) => {
    setTextInput(target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    textInput && setId(textInput)
  }

  useEffect(() => {
    fetch(`${baseURL}/location/${id}`)
      .then(res => res.json())
      .then(data => {
        setLocation(data)
      })
      .catch(() => {
        console.log('this location does not exist')
      })
    setPage(0)
  }, [id])

  useEffect(() => {
    setTotalResidents(location?.residents.length)
  }, [location])

  const maxPage = Math.ceil(totalResidents / itemsPerPage)

  const onNextPage = () => {
    setPage((page + 1) % maxPage)
  }

  const onPrevPage = () => {
    setPage((page - 1) % maxPage)
  }

  return (
    <div className='container'>
      
      <div className="header">
        <div className="search">
          <div className="search-container">
            <form className="search-form" onSubmit={onSubmit}>
              <input
                className='search-input'
                onChange={onChange}
                placeholder='write location'
                type="text"
                name="location"
              />
              <button className='search-button' type="submit">Search</button>
            </form>
          </div>
        </div>

        <div className="location">
          <div className="location-container">
            <h2 className='location-title'>{location?.name}</h2>
            <div className="location-info">
              <p><span>Type: </span>{location?.type}</p>
              <p><span>Dimension:</span> {location?.dimension}</p>
              <p><span>Population:</span> {location?.residents.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="card-container">

          {location?.residents.length > 0
            ?
            location.residents.slice(page * itemsPerPage, itemsPerPage * (page + 1)).map((resident, index) => {
              return (
                <Card
                  key={index + 1}
                  url={resident}
                />
              )
            })
            :
            <p className="message">There are no residents to display at this location</p>
          }
        </div>
      </div>

        <div className="pagination">
          {totalResidents > itemsPerPage &&
            <>
              <div className="page-buttons">
                <button className='page-button' onClick={onPrevPage} disabled={!page}>Prev</button>
                <button className='page-button' onClick={onNextPage} disabled={page === Math.ceil(totalResidents / itemsPerPage) - 1}>Next</button>
              </div>
              <div className="index-page">
                <p>{page + 1} of {maxPage}</p>
              </div>
            </>
          }
        </div>
    </div>
  )
}

function Card({ url }) { // eslint-disable-line
  const [character, setCharacter] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCharacter(data)        
      })
  }, [url])

  return (
    <div className="card">
      <img className='card-img' src={character?.image} alt={character?.name} />
      <div className="card-info">
        <h3 className='card-name'>{character?.name}</h3>
        <p className='card-item'><span>Race:</span> {character?.species}</p>
        <p className='card-item'><span>Origin:</span> {character?.origin.name}</p>
        <p className='card-item'><span>Appearance episodes:</span> {character?.episode[0].split('/').at(-1)}</p>
      </div>
    </div>
  )
}

export default App
