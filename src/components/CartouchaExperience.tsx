import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Group } from 'three';
import modelFile from '../assets/3dmodel.glb';

interface ModelProps {
    mousePosition: { x: number; y: number };
    isLocked: boolean;
}

function Model({ mousePosition, isLocked }: ModelProps) {
    const { scene } = useGLTF(modelFile);
    const modelRef = useRef<Group>(null);

    useFrame(() => {
        if (modelRef.current) {
            if (!isLocked) {
                // Make the model react to mouse movement when not locked
                const targetRotationX = (mousePosition.y - 0.5) * 1.5;
                const targetRotationY = (mousePosition.x - 0.5) * 1.5;

                // Smooth interpolation for natural movement
                modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.1;
                modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1;
            } else {
                // When locked, smoothly return to center position (0, 0, 0)
                modelRef.current.rotation.x += (0 - modelRef.current.rotation.x) * 0.05;
                modelRef.current.rotation.y += (0 - modelRef.current.rotation.y) * 0.05;
            }
        }
    });

    return (
        <group ref={modelRef}>
            <primitive object={scene} scale={[2.5, 2.5, 2.5]} />
        </group>
    );
}

const CartouchaExperience = () => {
    const [inputName, setInputName] = useState('');
    const [hieroglyphResult, setHieroglyphResult] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isTouching, setIsTouching] = useState(false);

    // Egyptian symbols mapping
    const symbolMap = {
        'Love': '𓆸',        // Lotus flower (corrected)
        'Luck': '𓆣',        // Sacred scarab beetle (corrected)
        'Protection': '𓂀',   // Eye of Horus
        'Long Life': '𓋹'     // Ankh
    };

    const transliterateToHieroglyphs = (inputName: string) => {
        const hieroglyphMap: { [key: string]: string } = {
            "A": "𓄿", "B": "𓃀", "CH": "𓍿", "D": "𓂧", "E": "𓇋", "F": "𓆑",
            "G": "𓎼", "H": "𓉔", "I": "𓇋", "J": "𓆓", "K": "𓎡", "KH": "𓐍",
            "L": "𓃭", "M": "𓅓", "N": "𓈖", "O": "𓅱", "P": "𓊪", "PH": "𓆑",
            "Q": "𓎡", "R": "𓂋", "S": "𓋴", "SH": "𓈙", "T": "𓏏", "TH": "𓍘",
            "U": "𓅱", "V": "𓆑", "W": "𓅱", "X": "𓐍", "Y": "𓇋", "Z": "𓊃"
        };

        const digraphs = ["KH", "SH", "CH", "PH", "TH"];
        let name = inputName.toUpperCase()
            .replace(/C/g, "K").replace(/Q/g, "K").replace(/X/g, "KH").replace(/V/g, "F");

        // Remove consecutive duplicate letters
        let deduplicatedName = "";
        for (let i = 0; i < name.length; i++) {
            if (i === 0 || name[i] !== name[i - 1]) {
                deduplicatedName += name[i];
            }
        }
        name = deduplicatedName;

        let result = "";
        for (let i = 0; i < name.length; i++) {
            const pair = name.slice(i, i + 2);
            if (digraphs.includes(pair)) {
                result += (hieroglyphMap[pair] || "") + " ";
                i++;
            } else {
                const single = name[i];
                result += (hieroglyphMap[single] || "") + " ";
            }
        }
        return result;
    };

    const updateHieroglyphResult = (name: string, symbol: string | null) => {
        const nameHieroglyphs = name.trim() ? transliterateToHieroglyphs(name) : '';
        const symbolHieroglyph = symbol ? symbolMap[symbol as keyof typeof symbolMap] : '';

        if (nameHieroglyphs && symbolHieroglyph) {
            return nameHieroglyphs + '  ︎ ' + symbolHieroglyph;
        } else if (nameHieroglyphs) {
            return nameHieroglyphs;
        } else if (symbolHieroglyph) {
            return symbolHieroglyph;
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputName(value);
        setHieroglyphResult(updateHieroglyphResult(value, selectedSymbol));
    };

    const handleSymbolSelect = (symbol: string) => {
        const newSymbol = selectedSymbol === symbol ? null : symbol;
        setSelectedSymbol(newSymbol);
        setHieroglyphResult(updateHieroglyphResult(inputName, newSymbol));
    };

    const handleClearInput = () => {
        setInputName('');
        setSelectedSymbol(null);
        setHieroglyphResult('');
    };

    const updatePosition = (x: number, y: number) => {
        setMousePosition({
            x: x / window.innerWidth,
            y: y / window.innerHeight,
        });
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isTouching) { // Only update from mouse if not currently touching
                updatePosition(event.clientX, event.clientY);
            }
        };

        const handleTouchStart = (event: TouchEvent) => {
            setIsTouching(true);
            const touch = event.touches[0];
            if (touch) {
                updatePosition(touch.clientX, touch.clientY);
            }
            // Add body class to prevent scrolling
            document.body.classList.add('touch-active');
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            if (touch) {
                updatePosition(touch.clientX, touch.clientY);
            }
        };

        const handleTouchEnd = () => {
            setIsTouching(false);
            // Remove body class to restore scrolling
            document.body.classList.remove('touch-active');
        };

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            // Remove event listeners
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);

            // Clean up body class
            document.body.classList.remove('touch-active');
        };
    }, [isTouching]);

    return (
        <div className="cartoucha-experience">
            {/* Left Side - Hieroglyph Translator */}
            <div className="translator-section">
                <div className="translator-card">
                    <div className="translator-input-section">
                        <div className="input-group">
                            <label htmlFor="name-input" className="input-label">Enter your name</label>
                            <div className="input-container">
                                <input
                                    id="name-input"
                                    type="text"
                                    value={inputName}
                                    onChange={handleInputChange}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="Type your name here..."
                                    className="name-input"
                                    maxLength={8}
                                />
                                {inputName && (
                                    <button onClick={handleClearInput} className="clear-button" title="Clear input">×</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Symbol Selection Section */}
                    <div className="input-group">
                        <label className="input-label">Choose a blessing</label>
                        <div className="symbol-grid">
                            {Object.keys(symbolMap).map((symbol) => (
                                <button
                                    key={symbol}
                                    onClick={() => handleSymbolSelect(symbol)}
                                    className={`symbol-box ${selectedSymbol === symbol ? 'selected' : ''}`}
                                >
                                    <span className="symbol-hieroglyph">{symbolMap[symbol as keyof typeof symbolMap]}</span>
                                    <span className="symbol-name">{symbol}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* <div className="translator-output-section">
                        <div className="output-group">
                            <label className="output-label">Your name in hieroglyphs</label>
                            <div className="hieroglyph-display">
                                {hieroglyphResult ? (
                                    <span className="hieroglyph-text">{hieroglyphResult}</span>
                                ) : (
                                    <span className="placeholder-text">Hieroglyphs will appear here...</span>
                                )}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Right Side - 3D Model */}
            <div className="model-section">
                <div className="model-3d-container-large">
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ background: 'transparent' }}>
                        {/* Lighting setup */}
                        <ambientLight intensity={1.2} color="#ffffff" />
                        <directionalLight position={[0, 0, 10]} intensity={1.5} color="#ffffff" />
                        <directionalLight position={[0, 0, -10]} intensity={1} color="#ffd700" />
                        <directionalLight position={[-10, 0, 0]} intensity={1.2} color="#ffffff" />
                        <directionalLight position={[10, 0, 0]} intensity={1.2} color="#ffffff" />
                        <directionalLight position={[0, 10, 0]} intensity={1} color="#ffffff" />
                        <directionalLight position={[0, -10, 0]} intensity={0.8} color="#daa520" />
                        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
                        <pointLight position={[-5, 5, 5]} intensity={0.8} color="#ffffff" />
                        <pointLight position={[5, -5, 5]} intensity={0.8} color="#ffffff" />
                        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ffffff" />
                        <pointLight position={[0, 0, -5]} intensity={0.6} color="#ffd700" />
                        <pointLight position={[0, 8, 0]} intensity={0.5} color="#daa520" />

                        <Model mousePosition={mousePosition} isLocked={isInputFocused || inputName.length > 0} />

                        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} enableDamping={false} />
                    </Canvas>

                    {/* Text Overlay - Vertical text on the model */}
                    {hieroglyphResult && (
                        <div className="text-overlay">
                            <div
                                className="vertical-text"
                                style={{
                                    gap: `${Math.max(0.2, 0.5 - (hieroglyphResult.split(' ').filter(char => char.trim()).length * 0.05))}rem`
                                }}
                            >
                                {hieroglyphResult.split(' ').filter(char => char.trim()).map((char, index) => (
                                    <span
                                        key={index}
                                        className="hieroglyph-text"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartouchaExperience; 