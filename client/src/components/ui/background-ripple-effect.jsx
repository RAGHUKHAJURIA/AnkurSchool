import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export const BackgroundRippleEffect = () => {
    const [clickedCell, setClickedCell] = useState(null);
    const [rippleKey, setRippleKey] = useState(0);
    const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });
    const ref = useRef(null);

    useEffect(() => {
        const calculateDimensions = () => {
            const cellSize = 50;
            const cols = Math.ceil(window.innerWidth / cellSize) + 2;
            const rows = Math.ceil(window.innerHeight / cellSize) + 2;
            setDimensions({ rows, cols });
        };

        calculateDimensions();
        window.addEventListener('resize', calculateDimensions);
        
        return () => window.removeEventListener('resize', calculateDimensions);
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                "fixed inset-0 h-full w-full overflow-hidden cursor-pointer bg-black",
                "[--cell-border-color:rgba(255,255,255,0.3)] [--cell-fill-color:rgba(30,30,30,0.8)] [--cell-shadow-color:rgba(0,0,0,0.8)]"
            )}>
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
                <DivGrid
                    key={`base-${rippleKey}`}
                    className="absolute inset-0"
                    rows={dimensions.rows}
                    cols={dimensions.cols}
                    cellSize={50}
                    borderColor="var(--cell-border-color)"
                    fillColor="var(--cell-fill-color)"
                    clickedCell={clickedCell}
                    onCellClick={(row, col) => {
                        setClickedCell({ row, col });
                        setRippleKey((k) => k + 1);
                    }}
                    interactive />
            </div>
        </div>
    );
};

const DivGrid = ({
    className,
    rows = 12,
    cols = 40,
    cellSize = 50,
    borderColor = "rgba(255,255,255,0.3)",
    fillColor = "rgba(30,30,30,0.8)",
    clickedCell = null,
    onCellClick = () => { },
    interactive = true
}) => {
    const cells = useMemo(() => Array.from({ length: rows * cols }, (_, idx) => idx), [rows, cols]);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        width: `${cols * cellSize}px`,
        height: `${rows * cellSize}px`,
        position: "absolute",
        top: 0,
        left: 0,
    };

    return (
        <div 
            className={cn("relative z-0", className)} 
            style={gridStyle}
        >
            {cells.map((idx) => {
                const rowIdx = Math.floor(idx / cols);
                const colIdx = idx % cols;
                const distance = clickedCell
                    ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
                    : 0;
                const delay = clickedCell ? Math.max(0, distance * 40) : 0;
                const duration = 150 + distance * 60;

                const style = clickedCell
                    ? {
                        "--delay": `${delay}ms`,
                        "--duration": `${duration}ms`,
                    }
                    : {};

                return (
                    <div
                        key={`${idx}-${clickedCell ? 'clicked' : 'static'}`}
                        className={cn(
                            "cell relative border-[1px] opacity-80 transition-all duration-200 will-change-transform hover:opacity-100 hover:bg-white/30 cursor-pointer",
                            "[box-shadow:0px_0px_20px_1px_var(--cell-shadow-color)_inset]",
                            clickedCell && "animate-cell-ripple [animation-fill-mode:forwards]",
                            !interactive && "pointer-events-none"
                        )}
                        style={{
                            backgroundColor: fillColor,
                            borderColor: borderColor,
                            ...style,
                        }}
                        onClick={
                            interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
                        } />
                );
            })}
            
            {/* Add the CSS animation */}
            <style>{`
                @keyframes cellRipple {
                    0% {
                        opacity: 0.8;
                        background-color: rgba(30, 30, 30, 0.8);
                        transform: scale(1);
                        border-color: rgba(255, 255, 255, 0.3);
                    }
                    50% {
                        opacity: 1;
                        background-color: rgba(75, 85, 99, 0.9);
                        transform: scale(1.15);
                        border-color: rgba(255, 255, 255, 0.6);
                    }
                    100% {
                        opacity: 0.8;
                        background-color: rgba(30, 30, 30, 0.8);
                        transform: scale(1);
                        border-color: rgba(255, 255, 255, 0.3);
                    }
                }
                
                .animate-cell-ripple {
                    animation: cellRipple var(--duration) ease-out var(--delay) forwards;
                }
            `}</style>
        </div>
    );
};