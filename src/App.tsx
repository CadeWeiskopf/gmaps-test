import React, { useState } from "react";
import "./App.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

interface ILocation {
  id: string;
  position: google.maps.LatLngLiteral | google.maps.LatLng;
  address: string;
}

const render = (status: string) => {
  switch (status) {
    case Status.LOADING:
      return <>"loading"</>;
    case Status.FAILURE:
      return <>"error"</>;
    case Status.SUCCESS:
      return <>"success"</>;
    default:
      return <>"unknown"</>;
  }
};

const MyMapComponent = ({
  center,
  zoom,
  locations,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  locations: ILocation[];
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      throw Error("missing ref");
    }

    const newMap = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
    newMap.setValues({
      styles: [
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
      ],
    });
    const bounds = new google.maps.LatLngBounds();

    // newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
    //   console.log(e);
    // });

    bounds.extend(center);
    locations.forEach((location: ILocation) => {
      bounds.extend(location.position);
      const newMarker = new google.maps.Marker();
      newMarker.setPosition(location.position);
      newMarker.setLabel(location.address);
      newMarker.setMap(newMap);
    });
    newMap.fitBounds(bounds, 60);

    const homeMarker = new google.maps.Marker();
    homeMarker.setPosition(center);
    homeMarker.setLabel("*");
    homeMarker.setMap(newMap);
    homeMarker.setIcon("house-fill.svg");
    homeMarker.setZIndex(1);
  });

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={ref}
      id="map"
    />
  );
};

function App() {
  const locations: ILocation[] = [
    {
      id: "0",
      address: "Baronsmede",
      position: { lat: 37.5210021, lng: -77.6479768 },
    },
    {
      id: "1",
      address: "Gobblersridge",
      position: { lat: 37.5542743, lng: -77.782204 },
    },
    {
      id: "2",
      address: "Colonyhouse",
      position: { lat: 37.4731774, lng: -77.6610978 },
    },
  ];

  const [selectedLocations, setSelectedLocations] = useState<ILocation[]>([]);

  if (!process.env.REACT_APP_API_KEY) {
    throw Error("missisng api key");
  }
  return (
    <div className="App">
      <header>test</header>
      <main>
        <Wrapper
          apiKey={process.env.REACT_APP_API_KEY}
          render={render}
        >
          <MyMapComponent
            center={{ lat: 37.5082949, lng: -77.7401627 }}
            zoom={15}
            locations={locations}
          />
          <MyMapComponent
            center={{ lat: 37.5082949, lng: -77.7401627 }}
            zoom={15}
            locations={selectedLocations}
          />
        </Wrapper>
        <div>
          <h2>Locations</h2>
          <ul>
            {locations.map((location, index) => {
              return (
                <li key={index}>
                  <input
                    type="checkbox"
                    onInput={(event: React.FormEvent<HTMLInputElement>) => {
                      const elementInSelected = selectedLocations.find(
                        (e) => e.id === location.id
                      );
                      if (elementInSelected && event.currentTarget.checked) {
                        return;
                      }
                      if (elementInSelected && !event.currentTarget.checked) {
                        selectedLocations.splice(
                          selectedLocations.indexOf(elementInSelected),
                          1
                        );
                      } else {
                        selectedLocations.push(location);
                      }
                      setSelectedLocations(selectedLocations.map((e) => e));
                    }}
                  />
                  {location.address}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <footer>test</footer>
    </div>
  );
}

export default App;
