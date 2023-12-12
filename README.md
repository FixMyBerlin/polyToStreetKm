# PolygonToStreetKm – Pre-Alpha

> Command line script that takes a Polygon,
> fetches road data from overpass and
> cuts the roads to match the polygon.

Similar to [`turf.bboxClip`](https://turfjs.org/docs/#bboxClip) but for Polygons.

## Pre-Alpha

Right now, this repo requires manual steps to run.

## Usage

Run with

```bash
bun run index.ts
```

## Ideas

- [ ] Maybe return a GeoJSON.io URI for the generated Polygon file as a command line result of the script.
  - GeoJSON Expects the URL with `encodeURIComponent(JSON.stringify(geojson_data))`.
  - Example: http://geojson.io/#data=data:application/json,%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B0%2C0%5D%2C%5B10%2C10%5D%5D%7D
