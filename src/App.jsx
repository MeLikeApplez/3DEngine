import { useEffect, useRef, useState } from 'react'
import './App.scss'

import _Engine from './Engine/Engine.js'
import Playground from './Playground/playground.js'

export default function App() {
    const CanvasRef = useRef()
    const FPSRef = useRef()

    const [ errorScreenMessage, setErrorScreenMessage ] = useState(null)
    const [ showErrorScreen, setShowErrorScreen ] = useState(false)
    
    const [ fps, setFPS ] = useState(null)
    const [ fpsLowInterval, setFpsLowInterval ] = useState(null)

    function ERROR_SCREEN(message) {
        setShowErrorScreen(() => true)
        setErrorScreenMessage(() => String(message))
    }

    useEffect(() => {
        console.clear()
        setShowErrorScreen(() => false)

        const Engine = new _Engine(CanvasRef.current, {
            ERROR_SCREEN: ERROR_SCREEN
        })

        Engine.on('load', () => Playground(Engine))

        let lowestFPS = Infinity

        Engine.on('update', () => {
            const currentFPS = (Engine.fps).toFixed()

            lowestFPS = Math.min(lowestFPS, currentFPS)

            setFPS(() => `${currentFPS} FPS / ${lowestFPS}L`)

            FPSRef.current.style.color = currentFPS >= 45 ? 'rgb(0, 250, 120)' : (
                currentFPS >= 30 && currentFPS < 45 ? 'rgb(250, 200, 50)' : 'rgb(250, 80, 80)'
            )
        })

        clearInterval(fpsLowInterval)

        setFpsLowInterval(() => {
            return setInterval(() => {
                lowestFPS = Infinity
            }, 1000)
        })

        // Engine._errorScreen = ERROR_SCREEN
        window.Engine = Engine

        Engine.setup()
        console.log(Engine)

        return () => Engine.destroy()
    }, [])

    return <div className="App">
        <div className="stats">
            <div className="fps" ref={FPSRef}>{ fps }</div>
        </div>

        <div className="error-screen" style={{ visibility: showErrorScreen ? 'visible' : 'hidden' }}>
            <header>
                <div>An error has occured</div>
                <div className="exit" onClick={() => setShowErrorScreen(() => false)}>Exit</div>
            </header>
            <code className="message">
                { errorScreenMessage }
            </code>
        </div>
        <canvas ref={CanvasRef} onContextMenu={e => e.preventDefault()}></canvas>
    </div>
}