import React from "react";
import "./App.css";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

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
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
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

    const newMarker = new google.maps.Marker();
    newMarker.setPosition(center);
    newMarker.setLabel("TEST LABEL");
    newMarker.setMap(newMap);
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
            center={{ lat: 37.521002, lng: -77.6502728 }}
            zoom={15}
          />
        </Wrapper>
      </main>
      <footer>test</footer>
    </div>
  );
}

export default App;
