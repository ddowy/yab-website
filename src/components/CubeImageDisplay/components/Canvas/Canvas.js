'use client'

import styles from './canvas.module.css'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


export default function Canvas() {

    const canvasParentRef = useRef(null)

    useEffect(() => {

        class ThreejsInstance {
            constructor() {
                this._Init()
            }
            
            _Init() {
                this._scene = new THREE.Scene()
                this._threejs = new THREE.WebGLRenderer()
                this._camera = new THREE.PerspectiveCamera(75, canvasParentRef.current.clientWidth / canvasParentRef.current.clientHeight, 0.1, 1000)
                this._camera.position.set(0, 0, 2.75);
                this._threejs.setSize(canvasParentRef.current.clientWidth, canvasParentRef.current.clientHeight)
                canvasParentRef.current.appendChild( this._threejs.domElement );
                this._orbitControls = new OrbitControls(this._camera, canvasParentRef.current)
                this._orbitControls.update()
                this._clock = new THREE.Clock()

                this._LoadModel()

                // CANVAS CHARACTERISTICS

                this._scene.background = new THREE.Color(0x1b264f)
                const light = new THREE.AmbientLight(0xffffff, 2)
                this._scene.add(light)

                window.addEventListener('resize', () => {
                    this._OnWindowResize()
                })

                this._RAF()
            }

            _LoadModel() {
                const loader = new GLTFLoader()
                loader.load('assets/yabcube.glb', (gltf) => {
                    const cube = gltf.scene
                    cube.position.set(-1, -1, 0.25)
                    this._mixer = new THREE.AnimationMixer(cube)
                    this._scene.add(cube)
                    const clip = gltf.animations.find(clip => clip.name === 'Float')
                    const action = this._mixer.clipAction(clip)
                    this._mixer.update(this._clock.getDelta())
                    action.loop = THREE.LoopRepeat
                    action.play()
                })
            }

            _OnWindowResize() {
                this._camera.aspect = canvasParentRef.current.clientWidth / canvasParentRef.current.clientHeight;
                this._camera.updateProjectionMatrix();
                
                this._threejs.setSize(canvasParentRef.current.clientWidth, canvasParentRef.current.clientHeight);   
            }

            _RAF() {
                requestAnimationFrame(() => {
                    this._threejs.render(this._scene, this._camera)
                    if (this._mixer) {
                        this._mixer.update(this._clock.getDelta())
                    }
                    this._orbitControls.update()
                    this._RAF()
                })
            }
        }
        
        const _APP = new ThreejsInstance()

        return () => {
            _APP._threejs.dispose();
            if (canvasParentRef.current) {
                canvasParentRef.current.removeChild(_APP._threejs.domElement)
            }
        };
    })
    return (
        <div ref={canvasParentRef} className={styles.canvasParentRef}></div>
    )
}

