import { Button } from "./Button";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = (
   { position, heading, subheading, ctabt1, ctabt2, codeblock }
) => {
    return (
        <div className={`flex flex-col ${position === 'flex-row' ? 'md:flex-row' : 'md:flex-row-reverse'} my-12 md:my-20 gap-10 md:gap-20 w-full`}>

            {/* Section 1 */}
            <div className="flex flex-col gap-2 w-full md:w-[50%]">
                <div className="text-white text-[30px] font-medium">
                    {heading}
                </div>
                <div className="w-[90%] text-[15px] font-[500] text-[#94a3b8] gap-5 leading-8">
                    {subheading}¯¯
                </div>
                <div className="flex gap-7">
                    <Button active={ctabt1.active} linkto={ctabt1.linkto}>
                        {ctabt1.text}
                    </Button>
                    <Button linkto={ctabt2.linkto}>
                        {ctabt2.text}
                    </Button>
                </div>
            </div>

            {/* Section 2 - Code Editor */}
            <div className="flex items-center justify-center w-full md:w-[50%] p-4 md:p-6">
                {/* Outer Frame - subtle flat double-border effect */}
                <div className="p-[4px] rounded-[24px] bg-[#391fc7] shadow-2xl w-full ">

                    {/* Main Editor Window */}
                    <div className="flex flex-col w-full bg-[#0a0a0a] rounded-[20px] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
                            {/* Window Controls */}
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>

                            {/* Title */}
                            <div className="text-gray-200 text-[13px] font-medium tracking-wide">
                                hello.cpp
                            </div>

                            {/* Live Coding Badge */}
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                                <span className="text-[#27c93f] text-[12px] font-medium">Live Coding</span>
                            </div>
                        </div>

                        {/* Code Area */}
                        <div className="flex flex-row py-5 bg-[#0a0a0a]">
                            {/* Line numbers */}
                            <div className="text-right flex flex-col w-[12%] text-[#4b5563] font-mono text-[14px] leading-[1.7] pr-4 select-none">
                                {Array.from({ length: 15 }, (_, i) => (
                                    <p key={i}>{String(i + 1).padStart(2, '0')}</p>
                                ))}
                            </div>

                            {/* Animated Code */}
                            <div className="flex w-[88%] flex-col overflow-hidden pl-1">
                                <TypeAnimation
                                    sequence={[codeblock, 1000, ""]}
                                    repeat={Infinity}
                                    speed={40}
                                    deletionSpeed={40}
                                    cursor={true}
                                    wrapper="pre"
                                    style={{
                                        whiteSpace: 'pre',
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                        lineHeight: '1.7',
                                        color: '#e5e7eb',
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodeBlocks;
