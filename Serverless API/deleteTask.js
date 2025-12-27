const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Tasks';

exports.handler = async (event) => {
    try {
        // 1. Validate input
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

        // 2. Check if task exists first
        const checkParams = {
            TableName: tableName,
            Key: { taskId: taskId }
        };
        
        const existingTask = await dynamoDB.get(checkParams).promise();
        if (!existingTask.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `Task with ID ${taskId} not found` 
                })
            };
        }

        // 3. Delete the task from DynamoDB
        const deleteParams = {
            TableName: tableName,
            Key: { taskId: taskId }
        };

        await dynamoDB.delete(deleteParams).promise();

        // 4. Return success response
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Task deleted successfully',
                deletedTaskId: taskId
            })
        };
        
    } catch (error) {
        console.error('Error deleting task:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Failed to delete task',
                details: error.message 
            })
        };
    }
};