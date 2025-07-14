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
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isInputFocused, setIsInputFocused] = useState(false);

    const transliterateToHieroglyphs = (inputName: string) => {
        const hieroglyphMap: { [key: string]: string } = {
            "A": "𓄿", "B": "𓃀", "CH": "𓍿", "D": "𓂧", "E": "𓇋", "F": "𓆑",
            "G": "𓎼", "H": "𓉔", "I": "𓇋", "J": "𓆓", "K": "𓎡", "KH": "𓐍",
            "L": "𓃭", "M": "𓅓", "N": "𓈖", "O": "𓅱", "P": "𓊪", "PH": "𓆑",
            "Q": "𓎡", "R": "𓂋", "S": "𓋴", "SH": "𓈙", "T": "𓏏", "TH": "𓍘",
            "U": "𓅱", "V": "𓆑", "W": "𓅱", "X": "𓐍", "Y": "𓇋", "Z": "𓊃"
        };

        const digraphs = ["KH", "SH", "CH", "PH", "TH"];
        const name = inputName.toUpperCase()
            .replace(/C/g, "K").replace(/Q/g, "K").replace(/X/g, "KH").replace(/V/g, "F");

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputName(value);
        setHieroglyphResult(value.trim() ? transliterateToHieroglyphs(value) : '');
    };

    const handleClearInput = () => {
        setInputName('');
        setHieroglyphResult('');
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: event.clientX / window.innerWidth,
                y: event.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="cartoucha-experience">
            {/* Left Side - Hieroglyph Translator */}
            <div className="translator-section">
                <div className="translator-card">
                    <div className="translator-header">
                        <h2 className="translator-title">Hieroglyphic Name</h2>
                    </div>

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
                                    maxLength={7}
                                />
                                {inputName && (
                                    <button onClick={handleClearInput} className="clear-button" title="Clear input">×</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="translator-output-section">
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
                    </div>
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