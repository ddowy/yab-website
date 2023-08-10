'use client'

import styles from './cubeImageDisplay.module.css'
import Canvas from './components/Canvas/Canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleArrowRight, faSleigh } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react'

export default function CubeImageDisplay() {

    const prevBtnRef = useRef(null)
    const nextBtnRef = useRef(null)

    return (
        <div className={styles.container}>
            <Canvas nextBtnRef={nextBtnRef} prevBtnRef={prevBtnRef}/>
            <div className={styles.btnContainer}>
                <FontAwesomeIcon ref={prevBtnRef} className={styles.prevBtn} icon={faCircleArrowLeft}/>
                <FontAwesomeIcon ref={nextBtnRef} className={styles.nextBtn} icon={faCircleArrowRight}/>
            </div>
        </div>
    )
}