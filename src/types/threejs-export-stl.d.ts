declare module "threejs-export-stl" {
    const mimeType: string
    function fromGeometry(geometry: THREE.Geometry | THREE.BufferGeometry, options?: object): Blob;
    function fromMesh(mesh: THREE.Mesh, options?: object): Blob;

    export { mimeType, fromGeometry, fromMesh }
}
