import { useCallback, useEffect, useRef, useState} from 'react';
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import {sortPlacesByDistance} from './loc.js'

const storedId=JSON.parse(localStorage.getItem('selectedPlaces'))||[]
const storedPlaces=storedId.map((id)=>AVAILABLE_PLACES.find((place)=>place.id===id));

function App() {
  // const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces,setAvailablePlaces]=useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const[modalopen,setModalOpen]=useState(false)

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((positon)=>{
      const sortedPlaces=sortPlacesByDistance(
        AVAILABLE_PLACES,
        positon.coords.latitude,
        positon.coords.longitude);
        
        setAvailablePlaces(sortedPlaces);
    })
    
  },[])
  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedId=JSON.parse(localStorage.getItem('selectedPlaces'))||[]
    if(storedId.indexOf(id)===-1){
      localStorage.setItem('selectedPlaces',JSON.stringify([id,...storedId]))
    }
  }

  const handleRemovePlace= useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalOpen(false)
    const storedId=JSON.parse(localStorage.getItem('selectedPlaces'))||[]
    localStorage.setItem('selectedPlaces',JSON.stringify(storedId.filter((id)=>id!==selectedPlace.current)))
  },[])
  

  return (
    <>
    <Modal open={modalopen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
    onCancel={handleStopRemovePlace}
    onConfirm={handleRemovePlace}
  />
    </Modal> 
      {/* ref={modal} yaha modal ko pehle ref pass kiya tha */}

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={'Sorting Plases to visit accourding to your location'}
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
