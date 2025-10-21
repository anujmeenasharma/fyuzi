'use client';

import Image from 'next/image';
import { useState } from 'react';

const ChatHistorySection = () => {
    const [isOpen, setIsOpen] = useState(true);

    const historyItems = [
        'Influencers near Lebanon',
        'Top 5 fitness influencers in Lebanon...',
        'Food related Influencers in India',
        'Fitness Influencers in India',
    ];

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between rounded-lg transition-colors mb-2"
            >
                <h1 className="text-white flex items-center gap-2">
                    <Image src="./assets/chatHistory.svg" height={24} width={24} alt="chatHistory" />
                    Chat History
                </h1>
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="#fff"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-[#D0D5DD]"></div>

                    <div className="space-y-2 pt-3">
                        {historyItems.map((item, index) => (
                            <button
                                key={index}
                                className={`w-full text-left px-4 text-sm py-2 rounded-full transition-colors relative ${index === 0
                                        ? 'bg-white text-[#343434]'
                                        : 'text-[#C1C1C1] hover:bg-white hover:text-[#343434]'
                                    }`}
                            >
                                <span className="block truncate">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHistorySection;