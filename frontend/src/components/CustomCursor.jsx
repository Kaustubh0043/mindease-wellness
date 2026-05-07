import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const mainCursor = useRef(null);
    const secondaryCursor = useRef(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;
            if (mainCursor.current) {
                mainCursor.current.style.transform = `translate3d(${clientX - 4}px, ${clientY - 4}px, 0)`;
            }
            if (secondaryCursor.current) {
                secondaryCursor.current.style.transform = `translate3d(${clientX - 16}px, ${clientY - 16}px, 0)`;
            }
        };

        const onMouseDown = () => setIsClicked(true);
        const onMouseUp = () => setIsClicked(false);

        // Track on window to catch every single pixel
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <>
            <div 
                ref={mainCursor}
                className={`luxury-dot ${isClicked ? 'clicked' : ''}`}
            />
            <div 
                ref={secondaryCursor}
                className={`luxury-outline ${isClicked ? 'clicked' : ''}`}
            />
            <style>{`
                .luxury-dot {
                    width: 8px;
                    height: 8px;
                    background: #8b5cf6; /* Solid Primary */
                    border-radius: 50%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 2147483647; /* Absolute Max Z-Index */
                    box-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
                    transition: width 0.3s, height 0.3s, background-color 0.3s;
                    will-change: transform;
                }
                .luxury-dot.clicked {
                    width: 4px;
                    height: 4px;
                    background: #f97316; /* Secondary color on click */
                    box-shadow: 0 0 15px rgba(249, 115, 22, 1);
                }
                .luxury-outline {
                    width: 32px;
                    height: 32px;
                    border: 2px solid #8b5cf6;
                    border-radius: 50%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 2147483646;
                    transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), width 0.3s, height 0.3s;
                    will-change: transform;
                }
                .luxury-outline.clicked {
                    width: 48px;
                    height: 48px;
                    border-color: #f97316;
                }
                html, body, * {
                    cursor: none !important;
                }
            `}</style>
        </>
    );
};

export default CustomCursor;
