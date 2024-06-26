// /utils/classifier.ts

export function classifyEmail(subject: string, content: string, labelIds: string[]): 'interested' | 'not interested' | 'more information' {
    try {
        // Ensure subject and content are defined and handle edge cases
        if (!subject || !content) {
            return 'not interested'; // or handle as per your business logic
        }

        // Example classification logic (adjust as per your criteria)
        if (subject.toLowerCase().includes('scheduled meeting') || content.toLowerCase().includes('please attend')) {
            return 'interested';
        } else if (subject.toLowerCase().includes('more information') || content.toLowerCase().includes('more information')) {
            return 'more information';
        } else {
            return 'not interested';
        }
    } catch (error) {
        console.error('Error classifying email:', error);
        return 'not interested'; 
    }
}
