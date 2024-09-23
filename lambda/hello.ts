export const handler = async (event: any): Promise<object> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `CDK here - you've hit ${event.path}\n`,
    }
}