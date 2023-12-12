import * as turf from '@turf/turf'

export type Bbox = ReturnType<typeof turf.bbox>
export type FeaturePolygon = ReturnType<typeof turf.polygon>
