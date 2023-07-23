import styles from './cubeImageDisplay.module.css'
import Canvas from './components/Canvas/Canvas'

export default function CubeImageDisplay() {
    return (
        <div className={styles.container}>
            <Canvas/>
        </div>
    )
}