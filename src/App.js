const { useState, useRef, useEffect } = wp.element;
import { useFetchCurrentDrop } from './hooks/useFetchCurrentDrop';
import mapboxgl from 'mapbox-gl'
// import mnDistricts from "./data/mn-districts.geojson";

// css
import 'mapbox-gl/dist/mapbox-gl.css';

const Popup = ({dispensary, license, category}) => (
    <div className='popup'>
        <h3>{dispensary}</h3>
        <p>{license}</p>
        <p>{category}</p>
    </div>
)



const App = () => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const mapContainer = useRef(null);
    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
    const map = useRef(null);
    const [lng, setLng] = useState(-106.818181);
    const [lat, setLat] = useState(39.188097);
    const [type, setType] = useState(null);
    const [zoom, setZoom] = useState(9);
    const { currentDrop } = useFetchCurrentDrop();
    
    console.log(currentDrop)

    

    
    useEffect(() => {

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/light-v10",
            center: [lng, lat],
            zoom: zoom,
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        // map.getBounds();

        // const handleConcentrates = map.current => {
        //     // setType(e.target.value);
        //     alert(type);
        //     // map.setFilter('recreational-layer', ['==', ['get', 'license'], type] )
        // }
    

        map.current.on("load", function () {
            map.current.addSource('dispensary-source', {
                'type': 'geojson',
                'data': currentDrop
            });
            map.current.addLayer({
                'id': 'recreational-layer',
                'type': 'circle',
                'source': 'dispensary-source',
                'paint': {
                    'circle-radius': 10,
                    'circle-color': '#FF0000',
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 1
                },
                'filter': ['==', ['get', 'license'], 'Recreational']
            });
            map.current.addLayer({
                'id': 'medical-layer',
                'type': 'circle',
                'source': 'dispensary-source',
                'paint': {
                    'circle-radius': 10,
                    'circle-color': '#1e90ff',
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 1
                },
                'filter': ['==', ['get', 'license'], 'Medical']
            })

            // handleConcentrates(map.current);

        })

        

        map.current.on('click', e => {
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['recreational-layer', 'medical-layer'],
            })
            if(features.length > 0) {
                const feature = features[0]
                const popupNode = document.createElement('div')
                wp.element.render(
                    <Popup 
                        dispensary={feature?.properties?.name}
                        license={feature?.properties?.license}
                        category={feature?.properties?.category}
                    />,
                    popupNode
                )
                popUpRef.current
                    .setLngLat(e.lngLat)
                    .setDOMContent(popupNode)
                    .addTo(map.current)
                
            }
        })

        // map.on('change', e => {
        //     map.setFilter('recreational-layer', ['==', ['get', 'license'], type] )
        // })

        return () => map.current.remove()
    }, [map.current]);


    const mapcontainer = {
        height: 400,
    };

    const sidebarcss = {
        color: "#000",
        padding: "6px 6px",
        zIndex: 1,
        top: 0,
        left: 0,
        margin: 12,
        borderRadius: 4,
    }
    
    return (
      <div style={{ textAlign: 'center', marginTop: 100, }}>
        <h2>Olio Finder</h2>
        <div>
            <div className="sidebar" style={sidebarcss}>
                {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
                <div class='session'>
                <p>Product Type:</p>
                <div class='row' id='filters'>
                    <input id='all' type='radio' name='toggle' value='all' checked='checked' />
                    <label for='all'>All</label>
                    <input id='concentrates' type='radio' name='toggle' value='concentrates'  />
                    <label for='concentrates'>Concentrates</label>
                    <input id='cartridges' type='radio' name='toggle' value='cartridges' />
                    <label for='cartridges'>Cartridges</label>
                    <input id='edibles' type='radio' name='toggle' value='edibles' />
                    <label for='edibles'>Edibles</label>
                </div>
                </div>

            </div>
            <div ref={mapContainer} className="map-container" style={mapcontainer} />
        </div>
      </div>
    );
  };
  export default App;





