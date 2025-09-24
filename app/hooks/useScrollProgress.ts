import { useEffect } from 'react';

export function useScrollProgress() {
    useEffect(() => {
        const scrollContainer = document.querySelector('.horizontal-scroll');
        if (!scrollContainer) return;

        const updateScrollProgress = () => {
            const scrollLeft = scrollContainer.scrollLeft;
            const scrollWidth = scrollContainer.scrollWidth;
            const clientWidth = scrollContainer.clientWidth;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            
            const progressBar = scrollContainer.querySelector('::after') as HTMLElement;
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        };

        scrollContainer.addEventListener('scroll', updateScrollProgress);
        return () => scrollContainer.removeEventListener('scroll', updateScrollProgress);
    }, []);
}
