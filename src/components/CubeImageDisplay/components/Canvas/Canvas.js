'use client'

import styles from './canvas.module.css'

import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

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
                this._camera.position.set(0, 1, 20);

                this._threejs.setSize(canvasParentRef.current.clientWidth, canvasParentRef.current.clientHeight)
                canvasParentRef.current.appendChild( this._threejs.domElement );

                // this._orbitControls = new OrbitControls(this._camera, canvasParentRef.current)
                // this._orbitControls.update()

                this._scene.background = new THREE.Color(0xffffff)

                this._AddBoxGeometry()

                // CANVAS CHARACTERISTICS

                this._scene.background = new THREE.Color(0x1b264f)

                window.addEventListener('resize', () => {
                    this._OnWindowResize()
                })

                this._RAF()
            }

            _AddBoxGeometry() {
                const geometry = new THREE.BoxGeometry(10, 10, 10)
                const material = new THREE.MeshBasicMaterial({ color: 0x8a0c1b })
                this._box = new THREE.Mesh(geometry, material)
                this._scene.add(this._box)
            }

            _OnWindowResize() {
                this._camera.aspect = canvasParentRef.current.clientWidth / canvasParentRef.current.clientHeight;
                this._camera.updateProjectionMatrix();
                
                this._threejs.setSize(canvasParentRef.current.clientWidth, canvasParentRef.current.clientHeight);   
            }

            _RAF() {
                requestAnimationFrame(() => {
                    this._threejs.render(this._scene, this._camera)
                    this._box.rotateX(0.01)
                    this._box.rotateY(0.01)
                    // this._orbitControls.update()
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

