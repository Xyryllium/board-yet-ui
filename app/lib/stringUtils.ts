export function formatIconText(text: string): string {
    const name = text.trim();
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length >= 2) {
    return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
}