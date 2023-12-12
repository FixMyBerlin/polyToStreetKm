import { Bbox } from '../types'

export const overpassQuery = (inputBbox: Bbox) => {
  const overpassBbox = `${inputBbox[1]},${inputBbox[0]},${inputBbox[3]},${inputBbox[2]}`

  return `[out: json];
(
  way["highway"="primary"]["area"!="yes"](${overpassBbox});
  way["highway"="primary_link"]["area"!="yes"](${overpassBbox});
  way["highway"="secondary"]["area"!="yes"](${overpassBbox});
  way["highway"="secondary_link"]["area"!="yes"](${overpassBbox});
  way["highway"="tertiary"]["area"!="yes"](${overpassBbox});
  way["highway"="tertiary_link"]["area"!="yes"](${overpassBbox});
  way["highway"="unclassified"]["area"!="yes"](${overpassBbox});
  way["highway"="residential"]["area"!="yes"](${overpassBbox});
  way["highway"="living_street"]["area"!="yes"](${overpassBbox});
  way["highway"="pedestrian"]["area"!="yes"](${overpassBbox});
  way["highway"="road"]["area"!="yes"](${overpassBbox});
  way["highway"="service"]["area"!="yes"]["service"!="driveway"]["service"!="parking_aisle"]["access"!="private"]["access"!="emergency"]["access"!="customers"]["access"!="no"]["access"!="destination"](${overpassBbox});

  way["highway"="construction"]["construction"="primary"](${overpassBbox});
  way["highway"="construction"]["construction"="primary_link"](${overpassBbox});
  way["highway"="construction"]["construction"="secondary"](${overpassBbox});
  way["highway"="construction"]["construction"="secondary_link"](${overpassBbox});
  way["highway"="construction"]["construction"="tertiary"](${overpassBbox});
  way["highway"="construction"]["construction"="tertiary_link"](${overpassBbox});
  way["highway"="construction"]["construction"="unclassified"](${overpassBbox});
  way["highway"="construction"]["construction"="residential"](${overpassBbox});
  way["highway"="construction"]["construction"="living_street"](${overpassBbox});
  way["highway"="construction"]["construction"="pedestrian"](${overpassBbox});
  way["highway"="construction"]["construction"="road"](${overpassBbox});
);
out body;>;out skel qt;`
}
