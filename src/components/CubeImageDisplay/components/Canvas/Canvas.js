'use client'

import styles from './canvas.module.css'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


export default function Canvas({nextBtnRef, prevBtnRef}) {

    const canvasParentRef = useRef(null)

    useEffect(() => {

        class CubeImageDisplay {
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
                this._animations = {}
                
                this._LoadModel()

                // CANVAS CHARACTERISTICS
                
                this._scene.background = new THREE.Color(0x1b264f)
                const light = new THREE.AmbientLight(0xffffff, 2)
                this._scene.add(light)
                
                nextBtnRef.current.addEventListener('click', () => {
                    this._UpdateAnimation('next')
                })
                prevBtnRef.current.addEventListener('click', () => {
                    this._UpdateAnimation('prev')
                })
                window.addEventListener('resize', () => {
                    this._OnWindowResize()
                })
                
                this._RAF()
            }
            
            _LoadModel() {
                const loader = new GLTFLoader()
                loader.load('assets/cube.glb', (gltf) => {
                    this._cube = gltf.scene
                    this._cube.position.set(-1, -1, 0)
                    this._mixer = new THREE.AnimationMixer(this._cube)
                    this._scene.add(this._cube)
                    this._CubeDisplayAdjusment(this._cube)

                    gltf.animations.forEach(animation => {
                        this._animations[animation.name] = this._mixer.clipAction(animation)
                    })

                    const clip = gltf.animations.find(clip => clip.name === 'Float')
                    const action = this._mixer.clipAction(clip)
                    this._mixer.update(this._clock.getDelta())
                    action.loop = THREE.LoopRepeat
                    action.play()
                })
            }

            _OnAnimationFinish(cube, currentAction, direction) {
                const turnValue = Math.PI / 2 // quarter turn in radians
                const yAxis = new THREE.Vector3(0, 1, 0)
                const q = new THREE.Quaternion()

                currentAction.setEffectiveWeight(0).stop()

                direction === 'next' ? q.setFromAxisAngle(yAxis, -turnValue) : q.setFromAxisAngle(yAxis, turnValue)                
                
                cube.applyQuaternion(q)
                
                this._animations.Float.reset().crossFadeFrom(currentAction, 0.2, true).play()

                const mixer = currentAction.getMixer()
                mixer.removeEventListener('finished', this._cb)
            }


            _UpdateAnimation(input) {
                const animations = this._animations;
                let currentAction;
                input === 'next' ? currentAction = animations.TurnRight : currentAction = animations.TurnLeft

                if (animations.TurnRight.isRunning() || animations.TurnLeft.isRunning()) return

                const namedFunctionWithParamaters = (cube, currentAction, direction) => {
                    return () => {
                        this._OnAnimationFinish(cube, currentAction, direction)
                    }
                } // So parameters can be passed to named function given to addEventListener

                this._cb = namedFunctionWithParamaters(this._cube, currentAction, input)

                const mixer = currentAction.getMixer();
                currentAction.reset();
                currentAction.setEffectiveWeight(1);
                currentAction.setLoop(THREE.LoopOnce, 1);
                currentAction.clampWhenFinished = true;
                currentAction.crossFadeFrom(animations.Float, 0.3, true);
                currentAction.play();

                mixer.addEventListener('finished', this._cb);
            }
            
            _ScaleCube() {

                // cube, camera, relativeZ = null

                const cameraZ = relativeZ !== null ? relativeZ : camera.position.z;
                const distance = cameraZ - cube.position.z;
                const vFov = camera.fov * Math.PI / 180;
                const scaleY = 2 * Math.tan(vFov / 2) * distance;
                const scaleX = scaleY * camera.aspect;
                cube.scale.set(scaleX, scaleY, scaleY);
            }

            _CubeDisplayAdjusment(cube) {
                const windowWidth = window.innerWidth

                if (windowWidth < 650) {
                    cube.scale.set(.65, .65, .65)
                    cube.position.set(0, -.25, 0)
                    nextBtnRef.current.style.height = '30px'
                    nextBtnRef.current.style.paddingTop = '250px'
                    prevBtnRef.current.style.height = '30px'
                    prevBtnRef.current.style.paddingTop = '250px'
                } else if (windowWidth < 950) {
                    cube.scale.set(.85, .85, .85)
                    cube.position.set(-.5, -.75, 0)
                    nextBtnRef.current.style.paddingTop = ''
                    prevBtnRef.current.style.paddingTop = ''
                } else {
                    cube.scale.set(1, 1, 1)
                    cube.position.set(-1, -1, 0)
                    nextBtnRef.current.style.height = ''
                    prevBtnRef.current.style.height = ''
                }
            }

            _OnWindowResize() {
                this._CubeDisplayAdjusment(this._cube)
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
        
        const _APP = new CubeImageDisplay()

        return () => {
            _APP._threejs.dispose();
            if (canvasParentRef.current) {
                canvasParentRef.current.removeChild(_APP._threejs.domElement)
            }
        };
    }, [canvasParentRef])
    return (
        <div ref={canvasParentRef} className={styles.canvasParentRef}></div>
    )
}

