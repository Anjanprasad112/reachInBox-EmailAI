
export function classifyEmail(subject: string, content: string, labelIds: string[]): 'interested' | 'not interested' | 'more information' {
    try {

        if (!subject || !content) {
            return 'not interested'; 
        }
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
