const { useState, useEffect } = wp.element;

export const useFetchCurrentDrop = () => {
    const [currentDrop, setCurrentDrop] = useState(null)

    useEffect(() => {
        const fetchDrop = async () => {
            const response = await fetch('https://olio-avada.test/wp-json/olio-droplist/v2/data')
            const data = await response.json()
            const geojson = {
                type: "FeatureCollection",
                features: data.map(item => {
                  return {
                    geometry: {
                        type: "Point",
                        coordinates: [JSON.parse(item.longitude), JSON.parse(item.latitude)]
                    },
                    type: "Feature",
                    properties: {
                      name: item.dispensary,
                      drop_date: item.drop_date,
                      license: item.license,
                      category: item.category
                    },
                    
                  };
                })
            };
            // setCurrentDrop(JSON.stringify(geojson));
            const dataJS = geojson;
            setCurrentDrop(dataJS);
        }

        fetchDrop()

    }, [])

    return { currentDrop }
}