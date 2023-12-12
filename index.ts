import * as turf from '@turf/turf'
import { Feature, GeoJsonProperties, LineString, Polygon } from 'geojson'
import osmtogeojson from 'osmtogeojson'
// @ts-ignore it works, no idea why it complaints
import bibi1 from './input/bibi1.json'
// @ts-ignore it works, no idea why it complaints
import bibi2 from './input/bibi2.json'
import { overpassQuery } from './utils/overpassQuery'

const inputPolygons = [bibi1 as Feature<Polygon, any>, bibi2 as Feature<Polygon, any>]

for (const [index, inputPoly] of Object.entries(inputPolygons)) {
  const bbox = turf.bbox(inputPoly)
  const query = overpassQuery(bbox)
  const apiUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Overpass API: ${response.status} ${response.statusText}`
    )
  }

  const rawOverpassData = await response.json()
  const overpassRoads = osmtogeojson(rawOverpassData)

  // Clip roads to polygon
  // Heavliy inspired by https://observablehq.com/@maptastik/clip-and-dissolve-lines-by-a-polygon
  const innerRoads: Feature<LineString, GeoJsonProperties>[] = []
  for (const road of overpassRoads.features) {
    // In Order to make TS happy we guard that all input is a lineString
    if (road.geometry.type !== 'LineString') {
      console.warn('Invalid geometry type', road.type)
      continue
    }
    const roadLinestring = road as Feature<LineString, GeoJsonProperties>

    // Check if the line feature is fully within the clip area. If it is, add it to linesArray.
    if (turf.booleanWithin(roadLinestring, inputPoly)) {
      innerRoads.push(roadLinestring)
    } else {
      // If the feature is not fully within the clip area, split the line by the clip area
      const splitResults = turf.lineSplit(roadLinestring, inputPoly)
      // Take the resulting features from the split, calculate a point on surface, and check if the point is within the clip area. If it is, add the line segment to linesArray.
      for (const splitResult of splitResults.features) {
        const pointOnRoad = turf.pointOnFeature(splitResult)
        if (turf.booleanWithin(pointOnRoad, inputPoly)) {
          innerRoads.push(
            turf.feature(splitResult.geometry, { ...roadLinestring.properties, _split: true })
          )
        }
      }
    }
  }

  let lengthTotalKm = 0
  const lengthHighwayType: Record<string, number> = {}
  const enhancedRoads: Feature<LineString, GeoJsonProperties>[] = []
  for (const road of innerRoads) {
    const length = Number(turf.length(road, { units: 'kilometers' }))
    lengthTotalKm += length
    const name = `${road.properties!.highway!}Km`
    lengthHighwayType[name] ||= 0
    lengthHighwayType[name] += length

    enhancedRoads.push(turf.feature(road.geometry, { ...road.properties, _length: length }))
  }

  console.log(
    'INFO',
    'Write',
    `./data/current/preparedRoads${index}.geojson`,
    'with',
    innerRoads.length,
    'items',
    'and a total length of',
    lengthTotalKm
  )
  Bun.write(
    `./output/current/preparedRoads${index}.geojson`,
    JSON.stringify(
      turf.featureCollection(innerRoads, { id: `${index}-length-${lengthTotalKm}` }),
      undefined,
      2
    )
  )
  Bun.write(
    `./output/current/polygon${index}.geojson`,
    JSON.stringify(
      turf.feature(inputPoly.geometry, { lengthTotalKm, ...lengthHighwayType }),
      undefined,
      2
    )
  )
}
