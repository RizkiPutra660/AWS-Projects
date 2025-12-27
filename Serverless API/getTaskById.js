const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Tasks';

exports.handler = async (event) => {
    try {
        // 1. Validate input: Extract and check taskId from path parameters
        const taskId = event.pathParameters?.id;
        
        if (!taskId) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Task ID is required in the path parameters' 
                })
            };
        }

        // 2. Query DynamoDB for the specific task (More efficient than scan)
        const params = {
            TableName: tableName,
            Key: {
                taskId: taskId
            }
        };

        const result = await dynamoDB.get(params).promise();

        // 3. Check if task was found
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `Task with ID ${taskId} not found` 
                })
            };
        }

        // 4. Return the found task
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.Item)
        };
    } catch (error) {
        console.error('Error fetching task:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Failed to fetch task',
                details: error.message 
            })
        };
    }
};