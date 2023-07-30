import styles from './cubeImageDisplay.module.css'
import Canvas from './components/Canvas/Canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function CubeImageDisplay() {
    return (
        <div className={styles.container}>
            <Canvas/>
            <div className={styles.btnContainer}>
                <FontAwesomeIcon className={styles.prevBtn} icon={faCircleArrowLeft}/>
                <FontAwesomeIcon className={styles.nextBtn} icon={faCircleArrowRight}/>
            </div>
        </div>
    )
}