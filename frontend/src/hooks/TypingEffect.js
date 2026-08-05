import { useEffect, useState } from "react";

export default function useTypingEffect(text, speed, delay = 200) {
    const [displayedText, setDisplayedText] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsFinished(false);

        const delayedTimeout = setTimeout(() => {
            let index = 1;

            const typingInterval = setInterval(() => {
                if (index <= text.length) {
                    setDisplayedText(text.slice(0, index));
                    index++;
                } else {
                    setIsFinished(true);
                    clearInterval(typingInterval);
                }
            }, speed);
            return () => clearInterval(typingInterval);
        }, delay);

        return () => clearTimeout(delayedTimeout);
    }, [text, delay, speed]);

    return { displayedText, isFinished };
}