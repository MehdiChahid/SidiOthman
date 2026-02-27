declare module 'three-bas' {
  import * as THREE from 'three';
  
  export const Utils: {
    separateFaces(geometry: THREE.BufferGeometry): void;
    computeCentroid(geometry: THREE.BufferGeometry, face: any): THREE.Vector3;
  };
  
  export const ShaderChunk: {
    [key: string]: string;
  };
  
  export class BasicAnimationMaterial extends THREE.ShaderMaterial {
    constructor(options: any, uniforms: any);
  }
  
  export class ModelBufferGeometry extends THREE.BufferGeometry {
    constructor(model: THREE.BufferGeometry);
    faceCount: number;
    modelGeometry: THREE.BufferGeometry;
    createAttribute(name: string, size: number): { array: number[] };
    bufferUVs(): void;
    bufferPositions(): void;
  }
}
